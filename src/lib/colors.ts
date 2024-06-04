import chroma from "chroma-js";

export enum ColorFormat {
	HEX = "hex",
	RGB = "rgb",
	HSL = "hsl",
	HSI = "hsi",
	HSV = "hsv",
	LAB = "lab",
	LCH = "lch"
}

export type CssColor = {
	all: string[]
	text: string[]
	background: string[]
	border: string[]
	fill: string[]
};

function groupColorsByHue(colors: string[]): string[] {
	return colors
		.map(color => ({ color, hsl: chroma(color).hsl() }))
		// Sorting primarily by hue (HSL[0]), then by saturation (HSL[1]), then by lightness (HSL[2])
		// Adding checks for undefined due to achromatic colors (black, white, grays) which have no hue
		.sort((a, b) => (a.hsl[0] ?? 360) - (b.hsl[0] ?? 360) || a.hsl[1] - b.hsl[1] || a.hsl[2] - b.hsl[2])
		.map(({ color }) => color);
}

// Detect URL, Transparent colors, and black/white
const isBadColor = (color: string): boolean => {
	try {
		// Test for URL, transparent, and invalid colors
		if (['url(', 'transparent'].some(prefix => color.startsWith(prefix)) || !chroma.valid(color)) {
			return true;
		}

		// Test for black, white, or transparent
		const [ r, g, b, alpha ] = chroma(color).rgba();
		return alpha === 0 || (r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255);
	} catch {
		return true;
	}
};

const getComputedColors = () => {
	const all = new Set<string>();
	const colors = new Set<string>();
	const bgColors = new Set<string>();
	const borderColors = new Set<string>();
	const fillColors = new Set<string>();

	document.querySelectorAll("*").forEach(el => {
		const style = getComputedStyle(el);

		if (style.color)
		{
			colors.add(style.color);
			all.add(style.color)
		}

		if (style.backgroundColor)
		{
			bgColors.add(style.backgroundColor);
			all.add(style.backgroundColor)
		}

		if (style.fill)
		{
			fillColors.add(style.fill);
			all.add(style.fill);
		}

		['borderBottomColor', 'borderTopColor', 'borderLeftColor', 'borderRightColor'].forEach((border) => {
			const key = border as keyof CSSStyleDeclaration;
			if (style && style[key] && typeof style[key] === "string") {
				borderColors.add(<string>style[key]);
				all.add(<string>style[key]);
			}
		});
	});

	return {
		all: [...all],
		text: [...colors],
		background: [...bgColors],
		border: [...borderColors],
		fill: [...fillColors]
	};
};

export const getCSSColors = async (tabId: number): Promise<CssColor | undefined> => {
	try {
		const colors =  await chrome.scripting.executeScript({
			target: {tabId},
			func: getComputedColors
		}).then((message) => {
			if (!message || !message[0] || !message[0].result)
			{
				throw new Error();
			}

			return message[0].result;
		});

		// Parse color and remove invalid colors
		Object.keys(colors).forEach(key => {
			// @ts-ignore
			colors[key] = colors[key].filter(color => !isBadColor(color)).map(color => chroma(color).hex());

			// Group colors by hue
			// @ts-ignore
			colors[key] = groupColorsByHue(colors[key]);
		});

		return colors;
	} catch (error) {
		console.error("failed to fetch CSS colors", error);
		throw new Error("Failed to fetch CSS colors...")
	}
}