let x_scales = [];
let y_scales = [];
let x_axis = [];
let y_axis = [];

let tags = []; // printed dimensions
let valid_keys = []; // Tutte le dimensioni numeriche
let non_numeric_keys = []; // Tutte le dimensioni NON numeriche
let non_numeric_values = [];

const max_dimensions = 5;
const x_number_of_ticks = 2;
const y_number_of_ticks = 2;
const radius = 3;
const colors = ["blue", "red", "green", "cyan", "purple", "brown", "violet", "grey", "yellow"];

/*
* Creazione assi x o y
*/
function createAxis(axis) {
	if (axis == "x") {
		x_scales.forEach(element => {
			x_axis.push(d3.axisBottom(element).ticks(x_number_of_ticks))
		});
	} else if (axis == "y") {
		y_scales.forEach(element => {
			y_axis.push(d3.axisLeft(element).ticks(y_number_of_ticks))
		});
	} else {
		alert("Wrong parameter in creation of axis");
	}
}

/*
* Crea e plotta le scale
*/
function createScales() {
	const xSpaceForSingleChart = (w - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length);
	const ySpaceForSingleChart = (h - padding * 2 - (tags.length - 1) * vertical_space) / (tags.length);
	tags.forEach((dimensionName, j) => {
		let d3MinMax = d3.extent(dataset, d => +d[dimensionName]); // min on d3MinMax[0] and max on d3MinMax[1]

		let current_x_scale = d3.scaleLinear()
			.domain([d3MinMax[0], d3MinMax[1]])
			.range([0, xSpaceForSingleChart]);

		let current_y_scale = d3.scaleLinear()
			.domain([d3MinMax[1], d3MinMax[0]])
			.range([0, ySpaceForSingleChart]);
		
		x_scales.push(current_x_scale);
		y_scales.push(current_y_scale);
	});
}

/*
* Controlla se i colori a disposizione bastano per rappresentare i valori
*/
function useBlack(key) {
	if (typeof non_numeric_keys.length !== "undefined") {
		if (non_numeric_keys.includes(key) && non_numeric_values[non_numeric_keys.indexOf(key)].length > colors.length) {
			return true;
		}
	}
	return false;
}

/*
* Descrivere
*/
function plot(key = non_numeric_keys[0]) {
	//let only_black = useBlack(key);

	takeValues();
	const xSpaceForSingleChart = (w - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length);
	const ySpaceForSingleChart = (h - padding * 2 - (tags.length - 1) * vertical_space) / (tags.length);
	const svg = d3.select("svg");
	convertDatasetToArray();
	let coord = [];
	y_scales.forEach((element, i) => {
		let beginning_y = padding + i * vertical_space + i * ySpaceForSingleChart;
		x_scales.forEach((inner_element, j) => {
			let beginning_x = padding + j * space_between_charts + j * xSpaceForSingleChart;
			svg.append("g")
				.attr("transform", "translate(" + beginning_x + ", " + beginning_y + ")")
				.call(y_axis[i])
				.attr("class", "axis" + (j != 0 ? " no_tick" : ""));

			svg.append("g")
				.attr("transform", "translate(" + beginning_x + ", " + (beginning_y + ySpaceForSingleChart) + ")")
				.call(x_axis[tags.length - j - 1])
				.attr("class", "axis" + (i != (tags.length - 1) ? " no_tick" : ""));

			array_dataset.forEach((row) => {
				let temp_coord = [];
				temp_coord.push(row[j]);	// x
				temp_coord.push(row[i]);	// y
				coord.push(temp_coord);
			});
		});
	});

	const boolForBlack = non_numeric_keys.length <= colors.length

	let aux = 0;
	coord.forEach((element) => {
		const auxiliary_index = Math.floor(aux / dataset.length);
		const x_scale_index = auxiliary_index % tags.length;
		const y_scale_index = Math.floor(auxiliary_index / tags.length);
		const x_scale = x_scales[x_scale_index];
		const y_scale = y_scales[y_scale_index];

		const x = padding
			+ x_scale(element[0])
			+ (tags.length - 1) * space_between_charts
			+ (tags.length - 1) * xSpaceForSingleChart
			- x_scale_index * space_between_charts
			- x_scale_index * xSpaceForSingleChart;

		const y = padding
			+ y_scale(element[1])
			+ y_scale_index * vertical_space
			+ y_scale_index * ySpaceForSingleChart;

		let color;

		if (boolForBlack && non_numeric_keys.includes(key)) {
			const dataset_index = aux - auxiliary_index * dataset.length;
			const single_element = dataset[dataset_index];
			const single_key_value = `${single_element[key]}`
			let key_position = non_numeric_keys.indexOf(key);
			let values = non_numeric_values[key_position];
			color = colors[values.indexOf(single_key_value)];
		} else {
			color = "black";
		}

		svg.append("circle")
			.attr("cx", x)
			.attr("cy", y)
			.attr("r", radius)
			.attr("class", "dot")
			.attr("fill", /*only_black ? "black" :*/ color);
		aux++;
	})
}

/*
* TODO: implement coloring on dimension
*/
function colorDimension(value, selectedIndex) {
	for(key in dataset[0]){

		if(key == value){

			let aux_data = dataset[0]
			
			if(!isNaN(parseFloat(`${aux_data[key]}`))){

				alert("You have to select a non numeric key.");
				//d3.selectAll('circle').attr('fill', 'black');
			}else{

				non_numeric_values = [];
				dataset.forEach((element)=>{

					if(non_numeric_values.indexOf(`${element[key]}`) == -1){

						non_numeric_values.push(`${element[key]}`);
					}
				});

				if(colors.length > non_numeric_values.length){
					d3.select("svg").selectAll("circle").remove()
					plot(key)
				}
			}
		}
	}
}


/*
* Controlla se il dataset è vuoto
*/
function isDatasetEmpty(dataset) {
	if (dataset.length == 0) {
		alert("Dataset empty");
		return true;
	}
	return false;
}

/*
* Crea nel HTML la select per le dimensioni non numeriche
*/
function injectSelectionInHTML(element, non_numeric_keys) {
	element.innerHTML += "<br/>"
	element.innerHTML += "<label for='color_selection'>(Non funziona) Colora una dimensione: </label>"
	element.innerHTML += "<select id = 'color_selection' onchange = 'colorDimension(value, selectedIndex)'>";
	const select = document.getElementById("color_selection");
	non_numeric_keys.forEach((element) => {
		select.innerHTML += `<option value = '${element}'> ${element}</option>`
	});
	element.innerHTML += "</select>"
}

/*
* Solo per DEBUG
*/
function stampa(questo) {
	console.log(questo);
}

/*
* Controlla che il numero di dimensioni selezionate non superi il limite
*/
function checkDimensionNumber(obj, checked) { 
	let number_of_checked = 0;

	if(checked){
		let div_element = document.getElementById("dimensionSelection");
		let childs = div_element.childNodes;
		childs.forEach((element) => {
			if(element.nodeName == "INPUT" && element.checked) {
				number_of_checked++;
			}
		});
		if(number_of_checked > max_dimensions) {
			obj.checked = false;
			alert("Reached max dimensions");
			return false;
		}
	}
	return true;
}

/*
* Descrivere
*/
function adaptScatterPlot(obj, checked) {
	if (checkDimensionNumber(obj, checked)) {
		if (checked) {
			tags.push(obj.value);	
		}else {
			tags = tags.filter(nameDimension => nameDimension != obj.value);
		}

		d3.select("svg").selectAll("*").remove();
		x_scales = [];
		y_scales = [];
		x_axis = [];
		y_axis = [];
		run();
	}
}

/*
* Descrivere
*/
function drawScatterPlot(dataset) {
	if (!isDatasetEmpty(dataset)) {
		let start = performance.now()
		clearAll();

		const element = document.getElementById("dimensionSelection");
		const aux_data = dataset[0];
		const keys = Object.keys(aux_data); // nome di ogni dimensione

		keys.forEach(element => {
			if (!isNaN(+(aux_data[element]))) {
				valid_keys.push(element); // dimensioni numeriche
			}
		});

		for (key in aux_data) {
			if (!valid_keys.includes(key) && isNaN(+(aux_data[element]))) {
				non_numeric_keys.push(key); // dimensioni NON numeriche
			}
		}

		takeValues();

		valid_keys.forEach(key => {
			if(tags.length < max_dimensions) {
				tags.push(key); // printed dimensions
			}
			element.innerHTML += `<div><label for = '${key}'> ` + makeReadable({key}) + `</label>`;
			element.innerHTML += `<input id = '${key}' type = 'checkbox' name = '${key}'`
				+ ((tags.includes(key)) ? "checked" : "")
				+ ` onchange = 'adaptScatterPlot(this, checked)' value = '${key}' />`;
			element.innerHTML += `</div>`;
		});

		injectSelectionInHTML(element, non_numeric_keys);

		element.innerHTML += "</br>"
		element.innerHTML += "<button onclick='updatePlot()' type='button'>Plot Again</button>"

		run();

		let end = performance.now();
		console.log(`Execution time: ${((end - start)/1000).toFixed(2)} seconds`);
	} else {
		alert("dataset empty!!!")
	}
}

function updatePlot() {
	console.log("updatePlot pressed");
	console.log("valid_keys: " + valid_keys);
}

/*
* Crea scale, assi e plotta
*/
function run() {
	createScales(); // ??
	createAxis("x"); // ??
	createAxis("y"); // ??
	plot();
}