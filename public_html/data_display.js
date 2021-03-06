
let dataset = [];

const width = 1100;
const heigth = 1100;
const padding = 60;
const space_between_charts = 0;
const vertical_space = 0;

function main() {
 	const svg = d3.select("#scatter_plot_content").append("svg").attr("width", width).attr("height", heigth);
 	getAll();
	lastSession();
}


/** Prende i dati della scorsa operazione fatta su HdViz (molto prototipo al momento in quanto sarà più grosso)
 * 	però funziona.*/
function lastSession(){

	fetch('/prevSession', {method:'GET'})
	.then(res => res.json())
	.then(res =>{
		dataset = [];
		if(res.hdConfig === 'csv') d3.csv(res.hdFilePath, data => dataset.push(data)).then(() => drawScatterPlot(dataset));
		else if(res.hdConfig === 'db') doSelection(res.hdDbSelection)

	});
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

			d3.csv(json.url, (data) => dataset.push(data)).then(() => {
				drawScatterPlot(dataset);})
	});
}