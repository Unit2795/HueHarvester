export type CssColor = {
	colors: string[]
	bgColors: string[]
	borderColors: string[]
	fillColors: string[]
};

export const getCSSColors = async (tabId: number): Promise<CssColor | undefined> => {
	try {
		return await chrome.scripting.executeScript({
			target: {tabId},
			func: () => {
				const colors = new Set<string>();
				const bgColors = new Set<string>();
				const borderColors = new Set<string>();
				const fillColors = new Set<string>();

				document.querySelectorAll("*").forEach(el => {
					const style = getComputedStyle(el);

					if (style.color)
					{
						colors.add(style.color);
					}

					if (style.backgroundColor && !style.backgroundColor.startsWith("url("))
					{
						bgColors.add(style.backgroundColor);
					}

					if (style.fill && !style.fill.startsWith("url("))
					{
						fillColors.add(style.fill);
					}

					['borderBottomColor', 'borderTopColor', 'borderLeftColor', 'borderRightColor'].forEach((border) => {
						const key = border as keyof CSSStyleDeclaration;
						if (style && style[key] && typeof style[key] === "string") {
							borderColors.add(<string>style[key]);
						}
					});
				});

				return {
					colors: [...colors],
					bgColors: [...bgColors],
					borderColors: [...borderColors],
					fillColors: [...fillColors]
				};
			}
		}).then((message) => {
			if (!message || !message[0] || !message[0].result)
			{
				throw new Error();
			}

			return message[0].result;
		});
	} catch (e) {
		console.error(`failed to fetch CSS colors: ${e}`);
		throw new Error("Failed to fetch CSS colors...")
	}
}