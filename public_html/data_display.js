const WIDTH = 1100;
const HEIGHT = 1100;
const PADDING = 60;
const SPACE_BETWEEN_CHARTS = 0;
const VERTICAL_SPACE = 0;

let dataset = [];



function main() {
 	const SVG = d3.select("#scatter_plot_content").append("svg").attr("width", WIDTH).attr("height", HEIGHT);
	lastSession();
}


/** loads last session data */
function lastSession(){
	fetch('/prevSession', {method:'GET'})
	.then(res => res.json())
	.then(res =>{
		dataset = [];
		if(res.hdConfig === 'csv')
			d3.csv(res.hdFilePath, data => dataset.push(data)).then(() => drawScatterPlot(dataset))});
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
			console.log(json.url)
			d3.csv(json.url, (data) => {
				dataset.push(data);
			})
		.then(() => {
			drawScatterPlot(dataset);
		})
	});
}
