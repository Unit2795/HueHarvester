import {useEffect, useState} from "react";
import Spinner from "./components/spinner/Spinner.tsx";
import {CssColor, getCSSColors} from "./lib/colors.ts";

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

            try {
                return chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    func: getCSSColors
                }).then((message) => {
                    if (!message || !message[0] || !message[0].result)
                    {
                        setError("Failed to extract CSS colors...");
                        return;
                    }

                    const result = message[0].result;

                    setCssColor(result);
                });
            } catch (e) {
                console.error(`failed to fetch CSS colors: ${e}`);
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
                <h2>Background Color</h2>
                <div className={"palette"}>
                    {
                        cssColor.bgColors.map((color, index) => (
                            <div key={index} style={{backgroundColor: color, width: "50px", height: "50px"}}>{color}</div>
                        ))
                    }
                </div>
                <h2>Text Color</h2>
                <div className={"palette"}>
                    {
                        cssColor.colors.map((color, index) => (
                            <div key={index} style={{backgroundColor: color, width: "50px", height: "50px"}}>{color}</div>
                        ))
                    }
                </div>
                <h2>Border Color</h2>
                <div className={"palette"}>
                    {
                        cssColor.borderColors.map((color, index) => (
                            <div key={index} style={{backgroundColor: color, width: "50px", height: "50px"}}>{color}</div>
                        ))
                    }
                </div>
                <h2>Fill Color</h2>
                <div className={"palette"}>
                    {
                        cssColor.fillColors.map((color, index) => (
                            <div key={index} style={{backgroundColor: color, width: "50px", height: "50px"}}>{color}</div>
                        ))
                    }
                </div>
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
