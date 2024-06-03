import './palette.css';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import {ChevronDown} from "lucide-react";

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
                                <div key={color} className={"w-16 flex flex-col"}>
                                    {/*Apply a white background behind the palette color, for RGBA colors*/}
                                    <div className={"w-full h-8 border-red  bg-white rounded-t-lg"}>
                                        <div className={"w-full h-full rounded-t-lg"} style={{backgroundColor: color}}/>
                                    </div>
                                    <div className={"w-full text-center side-gradient p-px flex-1 text-xs"}>{color}</div>
                                </div>
                                /*<div key={index} className={"min-h-24 w-32 border bg-white"}>
                                    <div className={"h-full w-full flex flex-col-reverse"} >
                                        <div className={"bg-white w-full min-h-8 bottom-0 text-black flex items-center p-1"} style={{ boxShadow: "inset 0 7px 9px -7px rgba(0,0,0,0.9)"}}>
                                            <span>{color}</span>
                                        </div>
                                    </div>
                                </div>*/
                            );
                        } )
                    }
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Palette;