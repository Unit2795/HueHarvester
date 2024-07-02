import './tooltip.css';
import {ReactNode} from "react";
import clsx from "clsx";

const Tooltip = (
	{
		children,
		tooltipText,
		classNames
	}: {
		children: ReactNode;
		tooltipText: string;
		classNames?: {
			tooltip?: string;
			tooltipText?: string
		};
	}
) => {
    return (
		<div className={clsx("tooltip", classNames?.tooltip)}>
			{children}
			<span className={clsx("tooltiptext", classNames?.tooltipText)}>{tooltipText}</span>
		</div>
	);
};

export default Tooltip;