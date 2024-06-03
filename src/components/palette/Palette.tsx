import './palette.css';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import {ChevronDown} from "lucide-react";

const ColorItem = (
    {
        color
    } : {
        color: string
    }
) => {
    return (
        <div key={color} className={"w-16 flex flex-col"}>
            {/*Apply a white background behind the palette color, for RGBA colors*/}
            <div className={"w-full h-8 border-red  bg-white rounded-t-lg relative cursor-pointer"}>
                <div className={"w-full h-full rounded-t-lg"} style={{backgroundColor: color}}/>
            </div>
            <div className={"w-full text-center side-gradient p-px flex-1 text-[10px]"}>{color}</div>
        </div>
    );
};

export const Palette = (
    {
        colors,
        title
    } : {
        colors: string[],
        title: string
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
                                <ColorItem color={color} key={color} />
                            );
                        } )
                    }
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Palette;