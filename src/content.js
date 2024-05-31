// Fetch all computed CSS colors from the current page
function getCSSColors() {
	const colors = new Set();
	// Iterate over all elements and compute styles
	[...document.querySelectorAll('*')].forEach(element => {
		const style = window.getComputedStyle(element);
		if (!style) {
			return;
		}
		if (style.color)
		{
			colors.add(style.color);
		}
		if (style.backgroundColor)
		{
			colors.add(style.backgroundColor);
		}
		if (style.borderColor)
		{
			colors.add(style.borderColor);
		}
	});

	// Remove null values and fully transparent colors
	const colorArray = [...colors].filter(Boolean).filter(color => {
		// Regular expression that matches RGBA values with a 0 alpha channel, to remove fully transparent colors
		const regex = /\brgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(\.0*)?\s*\)/g;
		return !regex.test(color);
	});

	return colorArray; // Remove empty values
}

getCSSColors();