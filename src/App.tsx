import {useEffect, useState} from "react";
import Spinner from "./components/spinner/Spinner.tsx";
import {CssColor, getCSSColors} from "./lib/colors.ts";
import Palette from "./components/palette/Palette.tsx";

function App() {
    const [loading, setLoading] = useState<string | null>("Loading Hue Harvester...");
    const [error, setError] = useState<string | null>(null);
    const [cssColor, setCssColor] = useState<CssColor>({
        colors: [],
        bgColors: [],
        borderColors: [],
        fillColors: []
    });

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
        <div>
            <div>
                <h1>CSS Colors</h1>
                <Palette colors={cssColor.bgColors} title={"Background Color"}/>
                <Palette colors={cssColor.colors} title={"Text Color"}/>
                <Palette colors={cssColor.borderColors} title={"Border Color"}/>
                <Palette colors={cssColor.fillColors} title={"Fill Color"}/>
            </div>
            {
                loading && !error && (
                    <div>
                        <p>{loading}</p>
                        <Spinner/>
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
