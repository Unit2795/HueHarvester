export const pageBase64 = (): Promise<string> => {
	return new Promise((resolve) => {
		chrome.tabs.captureVisibleTab(
			// @ts-ignore
			null,
			{
				format: "png"
			},
			(dataUrl) =>{
				resolve(dataUrl);
			}
		);
	})
};