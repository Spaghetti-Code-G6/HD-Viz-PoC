let dataset = [];

const w = 1080;
const h = 720;
const padding = 65;
const space_between_charts = 0;
const vertical_space = 0;

function main() {
	const svg = d3.select("#scatter_plot_content")
		.append("svg")
		.attr("width", w)
		.attr("height", h);
}

function sendData() {
	let file = document.getElementById("csvFile").files[0];
	const formData = new FormData();
	formData.append('csvFile', file);

	const options = {
		method: 'POST',
		body: formData,
	};

	fetch('/csv/file', options)
		.then(response => response.json())
		.then(json => {
			dataset = [];
			d3.csv(json.url, (data) => {
				dataset.push(data);
			})
		.then(() => {
			drawScatterPlot(dataset);
		})
	});
}