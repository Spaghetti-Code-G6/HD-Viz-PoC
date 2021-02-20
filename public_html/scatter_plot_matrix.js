let x_scales = [];
let y_scales = [];
let tags = [];
const max_dimensions = 5;
let x_axis = [];
let y_axis = [];


function clear_all(){

	x_scales = [];
	y_scales = [];
	tags = [];
	x_axis = [];
	y_axis = [];
	document.getElementById("dimensionSelection").innerHTML = "";
	d3.select("svg").selectAll("*").remove();
}

function make_readable(str){

	//TODO: Migliorarle
	aux = str.key.replace("_", " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);

	return aux;
}

function create_axis(axis){

	//ONLY THE CREATION
	console.log("Axis creation");
	if(axis == "x"){

		console.log(x_scales.length);
		let current_x_axis;

		x_scales.forEach((element) => {
			x_axis.push(d3.axisBottom(element))});
		
	}else if(axis == "y"){

		console.log(y_scales.length)		
		y_scales.forEach((element) => y_axis.push(d3.axisBottom(element)));
		
	}else{

		alert("Wrong parameter in creation of axis");
	}
}

function create_scales(){

	//console.log("creazione scale")
	let current_x_scale;
	let current_y_scale;
	let numeric_dimensions = 0;
	
	let datas = dataset[0];
	console.log(dataset[0]);

	let values = Object.values(datas);
	let indexes = [];
	let i = 0;

	values.forEach((element)=>{

		if(isNaN(element)){
		
			indexes.push(i);
		}
		i++;
	});

	console.log(indexes);

	const x_space_for_single_chart = (w - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length - indexes.length);
	const y_space_for_single_chart = (h - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length - indexes.length);
	let beginning_x;
	let beggining_y = padding;
	let aux_index = 0;

	tags.forEach( (element, j)=> {

		if(indexes.indexOf(j) == -1){

			console.log(element);
			let min = Number.POSITIVE_INFINITY;
			let max = Number.NEGATIVE_INFINITY;

			//console.log(parseFloat(`${datas[element]}`))
			dataset.forEach((row)=> {

				min = parseFloat(`${row[element]}`) < min ? parseFloat(`${row[element]}`) : min;
				max = parseFloat(`${row[element]}`) > max ? parseFloat(`${row[element]}`) : max;
			});

			//console.log("min: " + min);
			//console.log("max: " + max);

			let beginning_x = padding + aux_index * space_between_charts + aux_index * x_space_for_single_chart;
			//console.log(beginning_x);

			current_x_scale = d3.scaleLinear()
								.domain([min, max])
								.range([0, x_space_for_single_chart])

			//console.log(current_x_scale)

			current_y_scale = d3.scaleLinear()
								.domain([min, max])
								.range([0, y_space_for_single_chart])

			x_scales.push(current_x_scale);
			y_scales.push(current_y_scale);

			aux_index++;

		}

	});

}

function plot(){

	
}

function adapt_scatter_plot(obj, checked){

	let number_of_checked = 0;
	let checked_values = [];
	console.log(obj);
	console.log(checked);

	if(checked){
		let div_element = document.getElementById("dimensionSelection");
		let childs = div_element.childNodes;
		console.log(childs)
		childs.forEach((element) => {

			//console.log(element.checked);
			if(element.nodeName == "INPUT" && element.checked){

				number_of_checked++;
				console.log(element.value);
			}
		});

		if(number_of_checked > max_dimensions + 2){

			obj.checked = false;
			alert("Number of field selected exceeds maximum number of fields")
		}
	}

	//ONLY CHECKING NUMBER OF ELEMENTS SELECTED
}	

function draw(dataset){

	clear_all();
	
	let element = document.getElementById("dimensionSelection");

	//console.log(dataset[0]);
	
	for (key in dataset[0]){

		tags.push(key);
		
		element.innerHTML += `<label for = '${key}'> ` + make_readable({key}) + `</label>`;
		element.innerHTML += `<input id = '${key}' type = 'checkbox' name = '${key}' `
							 + ((tags.length <= max_dimensions) ? "checked" : "" ) +
							 ` onchange = 'adapt_scatter_plot(this, checked)' value = '${key}' />`


		//TODO: ADD A SELECT

	}

	//console.log(tags);

	create_scales();
	create_axis("x");
	create_axis("y");

	plot();

}