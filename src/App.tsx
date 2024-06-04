import {useEffect, useState} from "react";
import Spinner from "./components/spinner/Spinner.tsx";
import {ColorFormat, CssColor, getCSSColors} from "./lib/colors.ts";
import Palette from "./components/palette/Palette.tsx";
import {capitalize} from "./lib/helper.ts";

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

    async function calculateColors() {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tab.id) throw new Error("Failed to detect active tab...");

            setLoading(true);
            const newColors = await getCSSColors(tab.id);
            if (!newColors) throw new Error("Failed to detect CSS Colors...");

            setCssColor(newColors);
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
            <div className="flex justify-center items-center h-full">
                <Spinner />
                <p className="text-lg pt-4">Loading...</p>
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
