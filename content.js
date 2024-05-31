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
	const colorArray = [...colors].filter(Boolean); // Remove empty values
	return colorArray; // Remove empty values
}

getCSSColors();