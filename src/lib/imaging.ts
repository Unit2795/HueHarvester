export const pageBase64 = (tabId: number): Promise<string> => {
	return new Promise((resolve) => {
		chrome.debugger.attach(
			{
				tabId: tabId
			},
			"1.3",
			() => {
				chrome.debugger.sendCommand(
					{
						tabId: tabId
					},
					"Page.captureScreenshot",
					{
						format: "jpeg",
						quality: 100,
						captureBeyondViewport: true,
						fromSurface: true
					},
					(result) => {
						const typedResult = result as { data: string } | undefined;

						chrome.debugger.detach({ tabId }, () => {
							if (typedResult && typedResult.data)
							{
								const base64 = "data:image/jpeg;base64, " + typedResult.data;
								resolve(base64);
							}
						});
					}
				)
			}
		)
	})
};

function isValidBase64Image(base64String: string) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = base64String;
	});
}