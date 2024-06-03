import chroma from "chroma-js";

export type CssColor = {
	all: string[]
	colors: string[]
	bgColors: string[]
	borderColors: string[]
	fillColors: string[]
};

function groupColorsByHue(colors: string[]) {
	return colors.map(color => ({
		color,
		hsl: chroma(color).hsl()
	}))
		.sort((a, b) => {
			// Sorting primarily by hue (HSL[0]), then by saturation (HSL[1]), then by lightness (HSL[2])
			// Adding checks for undefined due to achromatic colors (black, white, grays) which have no hue
			return (a.hsl[0] === null ? 360 : a.hsl[0]) - (b.hsl[0] === null ? 360 : b.hsl[0]) ||
				a.hsl[1] - b.hsl[1] ||
				a.hsl[2] - b.hsl[2];
		})
		.map(entry => entry.color); // Returning sorted array of color strings
}

// Detect URL, Transparent colors, and black/white
const isBadColor = (color: string) => {
	let isValidColor = false;
	let chromaColor;
	try {
		isValidColor = chroma.valid(color);
		chromaColor = chroma(color);
	}
	catch (e) {
		return true;
	}

	// Get RGB values to check for pure black or pure white
	const [r, g, b] = chromaColor.rgb();
	if ((r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)) {
		return true; // Return true if the color is pure black or pure white
	}

	return !isValidColor ||
		color.startsWith("url(") ||
		color === "transparent" ||
		chromaColor.alpha() === 0;
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
		colors: [...colors],
		bgColors: [...bgColors],
		borderColors: [...borderColors],
		fillColors: [...fillColors]
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
			colors[key] = colors[key].filter(color => !isBadColor(color));

			// Group colors by hue
			// @ts-ignore
			colors[key] = groupColorsByHue(colors[key]);
		});

		return colors;
	} catch (e) {
		console.error(`failed to fetch CSS colors: ${e}`);
		throw new Error("Failed to fetch CSS colors...")
	}
}