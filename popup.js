document.addEventListener(
	'DOMContentLoaded',
	async function () {
		let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

		chrome.scripting.executeScript(
			{
				target: {
					tabId: tab.id,
					allFrames: true
				},
				files: ['content.js']
			},
			function(message) {
				const colorList = document.getElementById('css-colors');

				console.log(message);

				if (!message || !message[0] || !message[0].result || message[0].result.length === 0)
				{
					colorList.textContent = 'No colors found';
					return;
				}
				const colors = message[0].result;
				colors.forEach(color =>
					{
						const item = document.createElement('li');
						item.style = `background-color: ${color}`;
						colorList.appendChild(item);
					}
				);
			}
		);

		chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
			document.getElementById('site-preview').src = dataUrl;
			const image = new Image();
			image.onload = () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				canvas.width = image.width;
				canvas.height = image.height;
				context.drawImage(image, 0, 0);
				const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;

				const colorCounts = new Map();
				for (let i = 0; i < data.length; i += 4) {
					const color = `rgb(${data[i]}, ${data[i+1]}, ${data[i+2]})`;
					colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
				}

				const sortedColors = [...colorCounts.entries()].sort((a, b) => b[1] - a[1]);
				const topColors = sortedColors.slice(0, 200);
				displayColors(topColors);
			};
			image.src = dataUrl;
		});
	}
);

function displayColors(colors) {
	const colorList = document.getElementById('image-colors');
	colorList.innerHTML = ''; // Clear previous results
	colors.forEach(color => {
		const item = document.createElement('li');
		item.style = `background-color: ${color[0]}`;
		colorList.appendChild(item);
	});
}