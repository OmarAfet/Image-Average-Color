document.addEventListener("DOMContentLoaded", function () {
	const dropZone = document.getElementById("dropZone");
	const previewDiv = document.getElementById("preview");
	const previewImage = document.getElementById("previewImage");
	const resultDiv = document.getElementById("result");
	const colorBox = document.getElementById("colorBox");
	const rgbValue = document.getElementById("rgbValue");
	const hexValue = document.getElementById("hexValue");
	const hsvValue = document.getElementById("hsvValue");
	const copyRGB = document.getElementById("copyRGB");
	const copyHex = document.getElementById("copyHex");
	const copyHSV = document.getElementById("copyHSV");
	const body = document.body;

	function handleFile(file) {
		const reader = new FileReader();
		reader.onload = function (event) {
			const img = new Image();
			img.onload = function () {
				previewImage.src = event.target.result;
				previewDiv.classList.remove("hidden");

				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;

				let r = 0,
					g = 0,
					b = 0;
				for (let i = 0; i < data.length; i += 4) {
					r += data[i];
					g += data[i + 1];
					b += data[i + 2];
				}
				const pixelCount = data.length / 4;
				const avgR = Math.round(r / pixelCount);
				const avgG = Math.round(g / pixelCount);
				const avgB = Math.round(b / pixelCount);
				const avgColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
				const avgHexColor = rgbToHex(avgR, avgG, avgB);
				const avgHsvColor = rgbToHsv(avgR, avgG, avgB);

				colorBox.style.backgroundColor = avgColor;
				rgbValue.textContent = avgColor;
				hexValue.textContent = avgHexColor;
				hsvValue.textContent = avgHsvColor;

				resultDiv.classList.remove("hidden");
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
	}

	function handleDrop(e) {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		handleFile(file);
	}

	function handleChooseImage() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = function (event) {
			const file = event.target.files[0];
			handleFile(file);
		};
		input.click();
	}

	function rgbToHex(r, g, b) {
		const componentToHex = (c) => {
			const hex = c.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		};
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function rgbToHsv(r, g, b) {
		(r /= 255), (g /= 255), (b /= 255);
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h,
			s,
			v = max;

		const d = max - min;
		s = max === 0 ? 0 : d / max;

		if (max === min) {
			h = 0; // achromatic
		} else {
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		const hue = Math.round(h * 360);
		const saturation = Math.round(s * 100);
		const value = Math.round(v * 100);

		return `hsv(${hue}, ${saturation}%, ${value}%)`;
	}

	function copyToClipboard(elementId) {
		const element = document.getElementById(elementId);
		const value = element.textContent;

		navigator.clipboard
			.writeText(value)
			.then(() => {
				console.log(`Copied ${value} to clipboard`);
			})
			.catch((error) => {
				console.error("Copy failed:", error);
			});
	}

	dropZone.addEventListener("dragover", (e) => e.preventDefault());
	dropZone.addEventListener("drop", handleDrop);
	dropZone.addEventListener("click", handleChooseImage);
	copyRGB.addEventListener("click", () => copyToClipboard("rgbValue"));
	copyHex.addEventListener("click", () => copyToClipboard("hexValue"));
	copyHSV.addEventListener("click", () => copyToClipboard("hsvValue"));

	// Prevent file browser from opening when clicking anywhere on the page
	body.addEventListener("click", (e) => {
		if (e.target !== dropZone && e.target !== copyRGB && e.target !== copyHex && e.target !== copyHSV) {
			e.preventDefault();
			e.stopPropagation();
		}
	});
});
