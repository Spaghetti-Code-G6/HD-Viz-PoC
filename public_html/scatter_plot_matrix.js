let x_scales = [];
let y_scales = [];
let tags = [];
const max_dimensions = 5;
let indexes = [];
let x_axis = [];
let y_axis = [];
const number_of_ticks = 7;
let valid_keys = [];

function create_axis(axis){

	//ONLY THE CREATION
	//console.log("Axis creation");
	if(axis == "x"){

		//console.log(x_scales.length);
		let current_x_axis;

		x_scales.forEach((element) => {
			
			x_axis.push(d3.axisBottom(element).ticks(number_of_ticks))
		});
		
	}else if(axis == "y"){

		//console.log(y_scales.length)		
		y_scales.forEach((element) => {
			y_axis.push(d3.axisLeft(element).ticks(number_of_ticks))
		});
		
	}else{

		alert("Wrong parameter in creation of axis");
	}

	//console.log("Done axis")
}

function create_scales(){

	//console.log("creazione scale")
	let current_x_scale;
	let current_y_scale;
	let numeric_dimensions = 0;
	
	let datas = dataset[0];
	
	let values = Object.values(datas);
	let i = 0;

	values.forEach((element)=>{

		if(isNaN(element)){
		
			indexes.push(i);
		}
		i++;
	});

	let beginning_x;
	let beggining_y = padding;
	let aux_index = 0;

	const x_space_for_single_chart = (w - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length - indexes.length);
	const y_space_for_single_chart = (h - padding * 2 - (tags.length - 1) * vertical_space) / (tags.length - indexes.length);


	tags.forEach( (element, j)=> {

		if(indexes.indexOf(j) == -1){

			//console.log(element);
			let min = Number.POSITIVE_INFINITY;
			let max = Number.NEGATIVE_INFINITY;

			//console.log(parseFloat(`${datas[element]}`))
			dataset.forEach((row)=> {

				min = parseFloat(`${row[element]}`) < min ? parseFloat(`${row[element]}`) : min;
				max = parseFloat(`${row[element]}`) > max ? parseFloat(`${row[element]}`) : max;
			});

			//console.log(beginning_x);

			current_x_scale = d3.scaleLinear()
								.domain([min, max])
								.range([0, x_space_for_single_chart])

			//console.log(current_x_scale)

			current_y_scale = d3.scaleLinear()
								.domain([max, min])
								.range([0, y_space_for_single_chart])

			x_scales.push(current_x_scale);
			y_scales.push(current_y_scale);

			aux_index++;

		}

	});

}

function plot(){

	const x_space_for_single_chart = (w - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length - indexes.length);
	const y_space_for_single_chart = (h - padding * 2 - (tags.length - 1) * vertical_space) / (tags.length - indexes.length);

	const svg = d3.select("svg");
	const aux_data = dataset[0];

	const keys = Object.keys(aux_data);
	

	keys.forEach((element)=>{

		if(!isNaN(parseFloat(`${aux_data[element]}`))){

			valid_keys.push(element);
		}
	});

	//console.log(valid_keys);

	convert_dataset_to_array();

	//console.log(array_dataset)
	let coord = [];

	y_scales.forEach((element, i)=>{

		let beginning_y = padding + i * vertical_space + i * y_space_for_single_chart;
		//console.log("i: " + i);
		
		x_scales.forEach((inner_element, j)=> {

			//console.log("j: " + j);
			let beginning_x = padding + j * space_between_charts + j * x_space_for_single_chart;
			//console.log(beginning_x);

			svg.append("g")
			   .attr("transform", "translate(" + beginning_x + ", " + beginning_y + ")")
			   .call(y_axis[i])
			   .attr("class", "axis" + (j != 0 ? " no_tick" : ""));


			//console.log(typeof(index))

			svg.append("g")
			   .attr("transform", "translate(" + beginning_x + ", " + (beginning_y + y_space_for_single_chart) + ")")
			   .call(x_axis[j])
			   .attr("class", "axis"  + (i != (valid_keys.length - 1) ? " no_tick" : ""));

			let x_scale = x_scales[j];
			let y_scale = y_scales[i];

			array_dataset.forEach((element)=>{

				let temp_coord = [];
				
				temp_coord.push(element[j]);//x
				temp_coord.push(element[i]);//y

				coord.push(temp_coord);
			});

			//console.log("single one done")
		});

		//console.log("row done")

	});

	//console.log(coord);

	let aux = 0;

	console.log(dataset.length)
	console.log(valid_keys.length)


	coord.forEach((element)=>{

		const auxiliary_index = Math.floor(aux / dataset.length);
		const x_scale_index = auxiliary_index % valid_keys.length;
		const y_scale_index = Math.floor(auxiliary_index / valid_keys.length);
		let x_scale = x_scales[x_scale_index];
		let y_scale = y_scales[y_scale_index];

		//console.log(y_scale_index)
		//console.log(y_scale)

		let x = padding 
				+ x_scale(element[0])
				+ x_scale_index * space_between_charts
		 		+ x_scale_index * x_space_for_single_chart;


		let y = padding
				+ y_scale(element[1])
				+ y_scale_index * vertical_space
		 		+ y_scale_index * y_space_for_single_chart;

		console.log(y);

		svg.append("circle")
		   .attr("cx", x)
		   .attr("cy", y)
		   .attr("r", 5)
		   .attr("fill", "black");

		//console.log(aux)

		aux++;
	})

	console.log("done graph")

	let aux1 = 0;
	let aux2 = 0;

	/*coord.forEach((element)=>{


	});
*/
	//TODO: append circles

}

/*function adapt_scatter_plot(obj, checked){

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
}*/

function draw_scatter_plot(dataset){

	if(dataset.length == 0){

		alert("Dataset vuoto");
		return;
	}

	clear_all();
	
	let element = document.getElementById("dimensionSelection");
	
	for (key in dataset[0]){

		tags.push(key);
		
		element.innerHTML += `<label for = '${key}'> ` + make_readable({key}) + `</label>`;
		element.innerHTML += `<input id = '${key}' type = 'checkbox' name = '${key}' `
							 + ((tags.length <= max_dimensions) ? "checked" : "" ) +
							 ` onchange = 'adapt_scatter_plot(this, checked)' value = '${key}' />`


		//TODO: ADD A SELECT FOR COLORED DIMENSION

	}

	create_scales();
	create_axis("x");
	create_axis("y");

	plot();

}