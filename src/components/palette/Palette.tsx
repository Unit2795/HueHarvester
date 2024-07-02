import './palette.css';
import chroma from "chroma-js";
import {ColorFormat} from "../../lib/colors.ts";
import Tooltip from "../tooltip/tooltip.tsx";
import {useState} from "react";

const colorLabel = (hex: string, format: ColorFormat): string => {
    switch(format)
    {
        case "hex":
            return hex;
        case "hsi":
        case "hsv":
        case "hsl": {
            const [h, s, x] = chroma(hex)[format]();
            return `${isNaN(h) ? "0" : Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(x * 100)}%`;
        }
        case "rgb":
        case "lab":
        case "lch": {
            const [x, y, z] = chroma(hex)[format]();
            return `${Math.round(x)}, ${Math.round(y)}, ${isNaN(z) ? "0" : Math.round(z)}`;
        }
        default:
            return hex;
    }
};

const ColorItem = (
    {
        color,
        colorFormat
    } : {
        color: string,
        colorFormat: ColorFormat
    }
) => {
    const [tooltipLabel, setTooltipLabel] = useState(false);

    const label = colorLabel(color, colorFormat);

    return (
        <div className={"w-16 flex flex-col cursor-pointer"} onClick={() => {
            navigator.clipboard.writeText(label);
            setTooltipLabel(true);
            setTimeout(() => setTooltipLabel(false), 1000);
        }}>
            {/*Apply a white background behind the palette color, for RGBA colors*/}
            <Tooltip tooltipText={tooltipLabel ? "Copied!" : "Copy"} classNames={{
                tooltipText: tooltipLabel ? "text-lime-500" : "text-white"
            }}>
                <div className={"w-full h-8 border-red  bg-white rounded-t-lg relative"}>
                    <div className={"w-full h-full rounded-t-lg"} style={{backgroundColor: color}}/>
                </div>
                <div className={"w-full text-center side-gradient p-px flex-1 text-xs"}>{label}</div>
            </Tooltip>
        </div>
    );
};

export const Palette = (
    {
        colors,
        title,
        colorFormat
    } : {
        colors: string[],
        title: string,
        colorFormat: ColorFormat
    }
) => {
    return (
        <details open>
            <summary className={"h-12 hover:bg-stone-500 cursor-pointer text-xl p-2"}>{title} ({colors.length})</summary>
            <div className={"flex flex-wrap gap-4 w-[712px] mx-auto py-4 bg-stone-600 p-1"}>
                {colors.map((color) => <ColorItem color={color} key={color} colorFormat={colorFormat} />)}
            </div>
        </details>
    );
};

export default Palette;