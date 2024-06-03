import './palette.css';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import {ChevronDown} from "lucide-react";
import chroma from "chroma-js";
import {ColorFormat} from "../../App.tsx";

const colorLabel = (hex: string, format: ColorFormat): string => {
    switch(format)
    {
        case "hsi": {
            const [h, s, i] = chroma(hex).hsi();
            return `${isNaN(h) ? "0" : Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(i * 100)}%`;
        }
        case "hsv": {
            const [h, s, v] = chroma(hex).hsv();
            return `${isNaN(h) ? "0" : Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%`;
        }
        case "lab": {
            const [l, a, b] = chroma(hex).lab();
            return `${Math.round(l)}, ${Math.round(a)}, ${Math.round(b)}`;
        }
        case "lch": {
            const [l, c, h] = chroma(hex).lch();
            return `${Math.round(l)}, ${Math.round(c)}, ${isNaN(h) ? "0" : Math.round(h)}`;
        }
        case "rgb": {
            const [r, g, b] = chroma(hex).rgb();
            return `${r}, ${g}, ${b}`;
        }
        case "hsl": {
            const [h, s, l] = chroma(hex).hsl();
            return `${isNaN(h) ? "0" : Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
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
    const label = colorFormat === "hex" ? color : colorLabel(color, colorFormat)

    return (
        <div className={"w-16 flex flex-col cursor-pointer"} onClick={() => {
            navigator.clipboard.writeText(label);
        }}>
            {/*Apply a white background behind the palette color, for RGBA colors*/}
            <div className={"w-full h-8 border-red  bg-white rounded-t-lg relative"}>
                <div className={"w-full h-full rounded-t-lg"} style={{backgroundColor: color}}/>
            </div>
            <div className={"w-full text-center side-gradient p-px flex-1 text-xs"}>{label}</div>
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
        <Disclosure defaultOpen={true} as="div">
            <DisclosureButton className={"p-2 w-full text-left hover:bg-black/20 flex text-lg"}>{title} ({colors.length}) <ChevronDown className={"inline ml-auto"} /></DisclosureButton>
            <DisclosurePanel>
                <div className={"flex flex-wrap gap-4 w-[712px] mx-auto py-4 bg-stone-600 p-1"}>
                    {
                        colors.map((color) => {
                            return(
                                <ColorItem color={color} key={color} colorFormat={colorFormat} />
                            );
                        } )
                    }
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Palette;