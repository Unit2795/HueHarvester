import {useEffect, useState} from "react";
import Spinner from "./components/spinner/Spinner.tsx";
import {ColorFormat, CssColor, getCSSColors} from "./lib/colors.ts";
import Palette from "./components/palette/Palette.tsx";
import {capitalize} from "./lib/helper.ts";
import {pageBase64} from "./lib/imaging.ts";

const CalculateColors = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cssColor, setCssColor] = useState<CssColor>({
        all: [],
        text: [],
        background: [],
        border: [],
        fill: []
    });
    const [colorFormat, setColorFormat] = useState<ColorFormat>(ColorFormat.HEX);
    const [base64, setBase64] = useState<string>();

    async function calculateColors() {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tab.id) throw new Error("Failed to detect active tab...");

            setLoading(true);
            const newColors = await getCSSColors(tab.id);
            if (!newColors) throw new Error("Failed to detect CSS Colors...");

            setCssColor(newColors);

            const newBase64 = await pageBase64();
            console.log(newBase64);
            setBase64(newBase64);

            setLoading(false);
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
        }
    }

    useEffect(() => {
        calculateColors()
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full flex-col">
                <Spinner />
                <p className="text-lg pt-4">Harvesting Colors...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <>
            <div className="flex mb-6">
                <h1 className="text-xl">CSS Colors</h1>
                <select className="w-16 h-8 ml-auto" value={colorFormat} onChange={e => setColorFormat(e.target.value as ColorFormat)}>
                    {Object.values(ColorFormat).map(format => (
                        <option key={format} value={format}>{format.toUpperCase()}</option>
                    ))}
                </select>
            </div>
            <div className="divide-y divide-gray-400 bg-stone-700">
                {Object.keys(cssColor).map(key => (
                    <Palette key={key} colors={cssColor[key as keyof CssColor]} title={`${capitalize(key)} Colors`} colorFormat={colorFormat} />
                ))}
            </div>
            <div className="bg-stone-700 p-4 mb-6 max-h-96 overflow-y-auto mt-8">
                <img src={base64} alt="Screenshot" className="w-full rounded-md" />
            </div>
        </>
    );
};

function App() {
    return (
        <div className={"m-6 pb-10"}>
            <CalculateColors />
        </div>
    )
}

export default App
