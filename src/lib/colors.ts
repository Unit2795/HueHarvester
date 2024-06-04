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

// Ran directly as content script, cannot use any variables/dependencies outside of the function
const getComputedColors = () => {
	const colorProperties = ['color', 'backgroundColor', 'fill', 'borderBottomColor', 'borderTopColor', 'borderLeftColor', 'borderRightColor'];
	const colors = {
		all: new Set<string>(),
		color: new Set<string>(),
		backgroundColor: new Set<string>(),
		border: new Set<string>(),
		fill: new Set<string>()
	};

	document.querySelectorAll("*").forEach(el => {
		const style = getComputedStyle(el);
		colorProperties.forEach(prop => {
			const color = style[prop as keyof CSSStyleDeclaration];
			if (color && typeof color === 'string') {
				const key = (prop.includes('border') ? 'border' : prop) as keyof typeof colors;
				console.log(key, color);

				colors[key].add(color);
				colors.all.add(color);
			}
		});
	});

	return {
		all: [...colors.all],
		text: [...colors.color],
		background: [...colors.backgroundColor],
		border: [...colors.border],
		fill: [...colors.fill]
	};
};

export const getCSSColors = async (tabId: number): Promise<CssColor | undefined> => {
	try {
		const result = await chrome.scripting.executeScript({
			target: { tabId },
			func: getComputedColors
		});

		const colors = result[0]?.result;

		if (!colors) {
			throw new Error("No CSS colors found or invalid content script execution.");
		}

		// Parse color and remove invalid colors
		Object.keys(colors).forEach((key) => {
			const index = key as keyof CssColor;

			colors[index] = colors[index].filter(color => !isBadColor(color)).map(color => chroma(color).hex());

			colors[index] = groupColorsByHue(colors[index]);
		});

		return colors;
	} catch (error) {
		console.error("failed to fetch CSS colors", error);
		throw new Error("Failed to fetch CSS colors...")
	}
}