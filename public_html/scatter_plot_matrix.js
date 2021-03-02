let x_scales = [];
let y_scales = [];
let tags = [];
const max_dimensions = 5;
let indexes = [];
let x_axis = [];
let y_axis = [];
const x_number_of_ticks = 2;
const y_number_of_ticks = 2;
let valid_keys = [];
let non_numeric_keys = [];
let non_numeric_values = [];
const radius = 2;
const colors = ["blue", "red", "green", "yellow"];

/*
* Descrivere
*/
function createAxis(axis) {
	if (axis == "x") {
		x_scales.forEach((element) => {
			x_axis.push(d3.axisBottom(element).ticks(x_number_of_ticks))
		});
	} else if (axis == "y") {
		y_scales.forEach((element) => {
			y_axis.push(d3.axisLeft(element).ticks(y_number_of_ticks))
		});
	} else {
		alert("Wrong parameter in creation of axis");
	}
}

/*
* Descrivere
*/
function createScales() {
	let current_x_scale;
	let current_y_scale;
	let numeric_dimensions = 0;
	let datas = dataset[0];
	let values = Object.values(datas);
	let i = 0;

	values.forEach((element) => {
		if (isNaN(element)) {
			indexes.push(i);
		}
		i++;
	});

	let beginning_x;
	let beggining_y = padding;
	let aux_index = 0;
	let counter = 0;
	const x_space_for_single_chart = (w - padding * 2 - (valid_keys.length - 1) * space_between_charts) / (valid_keys.length);
	const y_space_for_single_chart = (h - padding * 2 - (valid_keys.length - 1) * vertical_space) / (valid_keys.length);

	tags.forEach((element, j) => {
		if (indexes.indexOf(j) == -1 && counter < max_dimensions) {
			let min = Number.POSITIVE_INFINITY;
			let max = Number.NEGATIVE_INFINITY;
			
			dataset.forEach((row) => {
				min = parseFloat(`${row[element]}`) < min ? parseFloat(`${row[element]}`) : min;
				max = parseFloat(`${row[element]}`) > max ? parseFloat(`${row[element]}`) : max;
			});

			current_x_scale = d3.scaleLinear()
				.domain([min, max])
				.range([0, x_space_for_single_chart])

			current_y_scale = d3.scaleLinear()
				.domain([max, min])
				.range([0, y_space_for_single_chart])

			x_scales.push(current_x_scale);
			y_scales.push(current_y_scale);

			aux_index++;
			counter++;
		}
	});
}

/*
* Controlla se i colori a disposizione bastano per rappresentare i valori
*/
function useBlack(key) {
	if (typeof non_numeric_keys.length !== "undefined") {
		if (non_numeric_keys.indexOf(key) != -1 && non_numeric_values[non_numeric_keys.indexOf(key)].length > colors.length) {
			return true;
		}
	}
	return false;
}

/*
* Descrivere
*/
function plot(key = non_numeric_keys[0]) {
	let only_black = useBlack(key);

	const x_space_for_single_chart = (w - padding * 2 - (valid_keys.length - 1) * space_between_charts) / (valid_keys.length);
	const y_space_for_single_chart = (h - padding * 2 - (valid_keys.length - 1) * vertical_space) / (valid_keys.length);
	const svg = d3.select("svg");
	const aux_data = dataset[0];
	const keys = Object.keys(aux_data);
	convertDatasetToArray();
	let coord = [];

	y_scales.forEach((element, i) => {
		let beginning_y = padding + i * vertical_space + i * y_space_for_single_chart;

		x_scales.forEach((inner_element, j) => {
			let beginning_x = padding + j * space_between_charts + j * x_space_for_single_chart;

			svg.append("g")
				.attr("transform", "translate(" + beginning_x + ", " + beginning_y + ")")
				.call(y_axis[i])
				.attr("class", "axis" + (j != 0 ? " no_tick" : ""));

			svg.append("g")
				.attr("transform", "translate(" + beginning_x + ", " + (beginning_y + y_space_for_single_chart) + ")")
				.call(x_axis[valid_keys.length - j - 1])
				.attr("class", "axis" + (i != (valid_keys.length - 1) ? " no_tick" : ""));

			let x_scale = x_scales[j];
			let y_scale = y_scales[i];

			array_dataset.forEach((element) => {
				let temp_coord = [];
				temp_coord.push(element[j]);	// x
				temp_coord.push(element[i]);	// y
				coord.push(temp_coord);
			});
		});
	});

	let aux = 0;

	coord.forEach((element) => {
		const auxiliary_index = Math.floor(aux / dataset.length);
		const x_scale_index = auxiliary_index % valid_keys.length;
		const y_scale_index = Math.floor(auxiliary_index / valid_keys.length);
		const x_scale = x_scales[x_scale_index];
		const y_scale = y_scales[y_scale_index];

		const x = padding
			+ x_scale(element[0])
			+ (valid_keys.length - 1) * space_between_charts
			+ (valid_keys.length - 1) * x_space_for_single_chart
			- x_scale_index * space_between_charts
			- x_scale_index * x_space_for_single_chart;

		const y = padding
			+ y_scale(element[1])
			+ y_scale_index * vertical_space
			+ y_scale_index * y_space_for_single_chart;

		let color;

		if (non_numeric_keys.indexOf(key) != -1) {
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
			.attr("fill", only_black ? "black" : color)
			.style("opacity", .5);
		aux++;
	})
}

/*
* Controlla che il numero di dimensioni selezionate non superi il limite
*/
function checkDimensionNumber(obj, checked) { 
	let number_of_checked = 0;
	let checked_values = [];

	if(checked){
		let div_element = document.getElementById("dimensionSelection");
		let childs = div_element.childNodes;
		childs.forEach((element) => {
			if(element.nodeName == "INPUT" && element.checked){
				number_of_checked++;
			}
		});
		if(number_of_checked > max_dimensions + 2){
			obj.checked = false;
			alert("Reached max dimensions")
		}
	}
}

/*
* Descrivere
*/
function adaptScatterPlot(obj, checked) {
	checkDimensionNumber(obj, checked);
}

/*
* Descrivere
*/
function stillNotExistingFunction(value, selectedIndex) {
	console.log('value: ' + value);
	console.log('selectedIndex: ' + selectedIndex);
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
* Crea nel HTML le dimensioni contenute nel aux_data
*/
function injectDimensionsInHTML(element, aux_data) {
	for (key in aux_data) {
		tags.push(key); // ??

		element.innerHTML += `<div><label for = '${key}'> ` + makeReadable({ key }) + `</label>`;
		element.innerHTML += `<input id = '${key}' type = 'checkbox' name = '${key}' `
			+ ((tags.length <= max_dimensions) ? "checked" : "")
			+ ` onchange = 'adaptScatterPlot(this, checked)' value = '${key}' />`;
		element.innerHTML += `</div>`;
	}
}

/*
* Crea nel HTML la select per le dimensioni non numeriche
*/
function injectSelectionInHTML(element, non_numeric_keys) {
	element.innerHTML += "<br/>"
	element.innerHTML += "<label for='color_selection'>Colora una dimensione: </label>"
	element.innerHTML += "<select id = 'color_selection' onchange = 'stillNotExistingFunction(value, selectedIndex)'>";
	const select = document.getElementById("color_selection");
	non_numeric_keys.forEach((element) => {
		select.innerHTML += `<option value = '${element}'> ${element}</option>`
	});
	element.innerHTML += "</select>"
}

/*
* Crea scale, assi e plotta
*/
function run() {
	console.log("Added HTML ")
	createScales(); // ??
	console.log("Created scale")
	createAxis("x"); // ??
	createAxis("y"); // ??
	console.log("Created axis")
	plot();
	console.log("Plotted")
}

/*
* Descrivere
*/
function drawScatterPlot(dataset) {
	if (!isDatasetEmpty(dataset)) {
		let start = performance.now()
		clearAll();
		console.log("Started")

		const element = document.getElementById("dimensionSelection");
		const aux_data = dataset[0];
		const keys = Object.keys(aux_data); // nome di ogni dimensione

		injectDimensionsInHTML(element, aux_data);

		keys.forEach((element) => {
			if (!isNaN(parseFloat(`${aux_data[element]}`)) && valid_keys.length < max_dimensions) {
				valid_keys.push(element); // dimensioni numeriche
			}
		});

		for (key in aux_data) {
			if (valid_keys.indexOf(key) == -1 && isNaN(parseFloat(`${aux_data[element]}`))) {
				non_numeric_keys.push(key); // dimensioni NON numeriche
			}
		}

		let j = 0;
		for (key in aux_data) {
			let aux = [];
			dataset.forEach((element) => {
				if ((valid_keys.indexOf(key) == -1) && (aux.indexOf(`${element[key]}`) == -1)) {
					aux.push(`${element[key]}`); // ??
				}
			})
			j++;
			if (aux.length != 0) {
				non_numeric_values.push(aux);
			}
		}

		injectSelectionInHTML(element, non_numeric_keys);

		run();

		let end = performance.now();
		console.log(`Execution time: ${end - start}ms`);
	}
}