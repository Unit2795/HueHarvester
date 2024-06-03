import {useEffect, useState} from "react";
import Spinner from "./components/spinner/Spinner.tsx";
import {CssColor, getCSSColors} from "./lib/colors.ts";
import Palette from "./components/palette/Palette.tsx";

export type ColorFormat = "rgb" | "hex" | "hsl";

function App() {
    const [loading, setLoading] = useState<string | null>("Loading Hue Harvester...");
    const [error, setError] = useState<string | null>(null);
    const [cssColor, setCssColor] = useState<CssColor>({
        all: [],
        colors: [],
        bgColors: [],
        borderColors: [],
        fillColors: []
    });
    // TODO: Switch this to hex once the text overflow issue on palette labels is fixed
    const [colorFormat, setColorFormat] = useState<ColorFormat>("hsl");

    async function calculateColors() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.id)
        {
            setLoading("Detecting CSS Colors...");

            const newColors = await getCSSColors(tab.id);

            if (newColors)
            {
                setCssColor(newColors);
                setLoading(null);
            } else
            {
                setError("Failed to detect CSS Colors...");
            }
        } else
        {
            setError("Failed to detect active tab...");
        }
    }

    useEffect(() => {
        calculateColors()
    }, []);

    return (
        <div className={"m-6 pb-10"}>
            {
                !loading && !error && (
                    <div>
                        <select value={colorFormat} onChange={(e) => {
                            setColorFormat(e.target.value as ColorFormat);
                        }}>
                            <option value="hex">Hex</option>
                            <option value="rgb">RGB</option>
                            <option value="hsl">HSL</option>
                        </select>
                        <h1 className={"text-xl"}>CSS Colors</h1>
                        <div className={"divide-y divide-gray-400 bg-stone-700 mt-6"}>
                            <Palette colors={cssColor.all} title={"All Colors"} colorFormat={colorFormat}/>
                            <Palette colors={cssColor.bgColors} title={"Background Colors"} colorFormat={colorFormat}/>
                            <Palette colors={cssColor.colors} title={"Text Colors"} colorFormat={colorFormat}/>
                            <Palette colors={cssColor.borderColors} title={"Border Colors"} colorFormat={colorFormat}/>
                            <Palette colors={cssColor.fillColors} title={"Fill Colors"} colorFormat={colorFormat}/>
                        </div>
                    </div>
                )
            }
            {
                loading && !error && (
                    <div className={"w-full h-full flex justify-center align-middle"}>
                        <div className={"flex-col flex"}>
                            <Spinner/>
                            <p className={"pt-4 text-lg"}>{loading}</p>
                        </div>
                    </div>
                )
            }
            {
                error && (
                    <div>
                        <p>{error}</p>
                    </div>
                )
            }
        </div>
    )
}

export default App
