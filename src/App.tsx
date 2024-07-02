import {useEffect, useState} from "react";
import Spinner from "./components/spinner/Spinner.tsx";
import {ColorFormat, CssColor, getColorCube, getCSSColors, getKMeans, getMedianCut, MedianCut} from "./lib/colors.ts";
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
    const [medianCut, setMedianCut] = useState<MedianCut>();
    const [kMeans, setKMeans] = useState<string[]>([]);
    const [colorCube, setColorCube] = useState<string[]>([]);

    async function calculateColors() {
        try {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tab.id) throw new Error("Failed to detect active tab...");

            setLoading(true);
            const newColors = await getCSSColors(tab.id);
            if (!newColors) throw new Error("Failed to detect CSS Colors...");

            setCssColor(newColors);

            const newBase64 = await pageBase64();
            setBase64(newBase64);

            const newMedian = await getMedianCut(newBase64);
            setMedianCut(newMedian);

            const newKMeans = await getKMeans(newBase64);
            setKMeans(newKMeans);

            const newColorCube = await getColorCube(newBase64);
            setColorCube(newColorCube);

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
                <h1 className="text-2xl">CSS Colors</h1>
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
            <hr className={"mt-12"}/>
            <h1 className="text-2xl mt-8 mb-6">Image Analysis Algorithm Colors</h1>
            <h1 className="text-lg mt-8 mb-6">Median Cut</h1>
            <div className="bg-stone-700">
                <Palette colors={medianCut?.dominantColor ? [medianCut?.dominantColor] : []} title="Median Cut Dominant Color" colorFormat={colorFormat} />
                <Palette colors={medianCut?.palette || []} title="Median Cut Colors" colorFormat={colorFormat} />
            </div>
            <h1 className="text-lg mt-8 mb-6">K-Means</h1>
            <div className="bg-stone-700">
                <Palette colors={kMeans || []} title="K-Means Colors" colorFormat={colorFormat} />
            </div>
            <h1 className="text-lg mt-8 mb-6">Color Cube</h1>
            <div className="bg-stone-700">
                <Palette colors={colorCube || []} title="Color Cube Colors" colorFormat={colorFormat} />
            </div>
            <h1 className="text-lg mt-8 mb-6">Captured Image</h1>
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
