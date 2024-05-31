document.addEventListener(
	'DOMContentLoaded',
	async function () {
		let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

		// Fetch all of the CSS colors from the current page using computed styles
		chrome.scripting.executeScript(
			{
				target: {
					tabId: tab.id,
					allFrames: true
				},
				files: ['dist/content.js']
			},
			function(message) {
				const colorList = document.getElementById('css-colors');

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

		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			files: ['src/html2canvas.min.js']
		}, () => {
			console.log('html2canvas loaded');
			chrome.scripting.executeScript(
				{
					target: {tabId: tab.id},
					files: ['src/canvas.js']
				},
				async function(message) {
					const dataUrl = message[0].result;
					const img = document.getElementById('site-preview');
					await new Promise((r) => {
						img.src = dataUrl;
						img.onload = r;
					})

					const colorThief = new ColorThief();

					const dominantColor = colorThief.getColor(img);

					document.getElementById('dominant-color').style.backgroundColor = `rgb(${dominantColor})`;

					const palette = colorThief.getPalette(img, 8);

					displayColors(palette);

					console.log(palette);

					//console.log('Dominant color:', dataUrl);
				}
			);
		});

		// Capture a screenshot of the current tab and analyze the colors
		/*chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
			const colorSimilarityThreshold = 20;

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

				const labCounts  = new Map();
				const totalPixels = data.length / 4;
				for (let i = 0; i < data.length; i += 4) {
					const [l, a, b] = LABColor.rgb2lab([data[i], data[i+1], data[i+2]]);
					let found = false;
					labCounts.forEach((count, key) => {
						if (!found && LABColor.areSimilar(key, [l, a, b], colorSimilarityThreshold)) {
							labCounts.set(key, count + 1);
							found = true;
						}
					});
					if (!found) {
						labCounts.set([l, a, b], 1);
					}
				}

				const sortedColors = [...labCounts.entries()].sort((a, b) => b[1] - a[1]);
				const topColors = sortedColors.slice(0, 200);

				const rgbColors = new Map();
				topColors.forEach((value, key, map) => {
					const [lab, occurrences] = value;
					const rgb = LABColor.lab2rgb(lab);
					const percentage = ((occurrences / totalPixels) * 100).toFixed(6);
					rgbColors.set(rgb, percentage);
				})

				console.log(rgbColors);
				displayColors(rgbColors);
			};
			image.src = dataUrl;
		});*/
	}
);

function takeScreenshot() {
	console.log("Hey!");
	/*html2canvas(document.body, {
		useCORS: true
	}).then(canvas => {
		const dataUrl = canvas.toDataURL('image/png');
		console.log("Testing 123");
		console.log(dataUrl);
		// You can handle the data URL according to your needs (save, send, etc.)
	});*/
}


function capturePageImage(tabId, scrollPosition) {
	chrome.scripting.executeScript({
		target: {
			tabId,
			allFrames: true
		},
		func: scrollToNext,
		args: [scrollPosition]
	});
}



// Display the calculated image colors and their frequency in the popup
function displayColors(colors) {
	const colorList = document.getElementById('image-colors');
	colorList.innerHTML = ''; // Clear previous results
	colors.forEach((value, key) => {
		const item = document.createElement('li');
		//item.textContent = `${value}%`;
		item.style = `background-color: rgb(${value})`;
		colorList.appendChild(item);
	});
}

/*
 RGB <-> LAB conversion functions and deltaE/similarity calculation
*/
// Courtesy of https://github.com/antimatter15/rgb-lab
// the following functions are based off of the pseudocode
// found on www.easyrgb.com
class LABColor {
	static lab2rgb(lab){
		let y = (lab[0] + 16) / 116,
			x = lab[1] / 500 + y,
			z = y - lab[2] / 200,
			r, g, b;

		x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
		y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
		z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);

		r = x *  3.2406 + y * -1.5372 + z * -0.4986;
		g = x * -0.9689 + y *  1.8758 + z *  0.0415;
		b = x *  0.0557 + y * -0.2040 + z *  1.0570;

		r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
		g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
		b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;

		return [
			Math.round(Math.max(0, Math.min(1, r)) * 255),
			Math.round(Math.max(0, Math.min(1, g)) * 255),
			Math.round(Math.max(0, Math.min(1, b)) * 255)
		]
	}

	static rgb2lab(rgb){
		let r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255,
			x, y, z;

		r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
		g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
		b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

		x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
		y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
		z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

		x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
		y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
		z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

		return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
	}

	// calculate the perceptual distance between colors in CIELAB
	// https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs
	static deltaE(labA, labB){
		let deltaL = labA[0] - labB[0];
		let deltaA = labA[1] - labB[1];
		let deltaB = labA[2] - labB[2];
		let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
		let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
		let deltaC = c1 - c2;
		let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
		deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
		let sc = 1.0 + 0.045 * c1;
		let sh = 1.0 + 0.015 * c1;
		let deltaLKlsl = deltaL / (1.0);
		let deltaCkcsc = deltaC / (sc);
		let deltaHkhsh = deltaH / (sh);
		let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
		return i < 0 ? 0 : Math.sqrt(i);
	}

	static areSimilar(labA, labB, threshold = 10) {
		const deltaE = this.deltaE(labA, labB);
		return deltaE < threshold;
	}
}


