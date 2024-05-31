async function captureCanvas() {
	const canvas = await html2canvas(document.body, {
		allowTaint: true,
		useCORS: true,
		logging: false,
	});

	const dataUrl = canvas.toDataURL('image/png');

	return dataUrl;
}

( async () => {
    return captureCanvas()
} )();
