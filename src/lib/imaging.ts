function isValidBase64Image(base64String: string) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = base64String;
	});
}

export const pageBase64 = async (tabId: number): Promise<string> => {
	try {
		await chrome.scripting.executeScript({
			target: {tabId},
			files: ["html2canvas.min.js"]
		});

		const result = await chrome.scripting.executeScript({
			target: {tabId},
			func: async () => {
				// @ts-ignore
				const canvas = await html2canvas(document.body, {
					allowTaint: true,
					useCORS: true,
					logging: false
				});

				const dataUrl = canvas.toDataURL('image/png');

				return dataUrl;
			}
		});

		const dataUrl = result[0].result;

		const isValid = await isValidBase64Image(dataUrl);

		if (!isValid) {
			throw new Error("Invalid base64 image...");
		}

		return dataUrl;
	} catch {
		throw new Error("Failed to capture page as base64 image...");
	}
};