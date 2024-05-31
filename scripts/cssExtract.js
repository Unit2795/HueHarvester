// Fetch all computed CSS colors from the current page
function getCSSColors() {
	const elements = ['html', 'body', 'p','div','a','button','input','span','h1','h2','h3','li','ul','table','th','tr','td'];
	const colorRegex = /^(#([0-9a-fA-F]{3}){1,2}|(rgb|hsl|hwb|lab|lch|oklab|oklch)a?\((-?\d+%?,\s*){2,3}-?\d*%?\))$/;
	const colorKeywords = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
	const cssColorMethods = [
		"color-adjust",
		"color-contrast",
		"color-gamut",
		"color-grayscale",
		"color-invert",
		"color-mix",
		"color-profile",
		"color-rendering",
		"color-saturation",
		"color-scheme",
		"color-stop",
		"color-temperature",
		"color",
		"color-interpolation"
	];

	const colors = new Set();

	elements.forEach(element => {
		document.querySelectorAll(element).forEach(el => {
			const style = getComputedStyle(el);
			const color = style.color;
			/*const bgColor = style.backgroundColor;
			const borderColor = style.borderColor;*/

			colors.add(color);
		});
	});

	return [...colors];
}

getCSSColors();