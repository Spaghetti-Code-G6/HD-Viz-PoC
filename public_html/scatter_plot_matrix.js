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
	document.getElementById("dimensionSelection").innerHTML = "";
	d3.select("svg").selectAll("*").remove();
}

function make_readable(str){

	aux = str.key.replace("_", " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);

	return aux;
}

function create_axis(scales){

	let current x_scale;
	let current_y_scale;
}

function create_scales(dimensions){


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


		//AGGIUNGERE SELECT PER CAPIRE QUALE DIMENSIONE VA CON I COLORI



	}

	console.log(tags);
	

	create_scales(tags);
	create_axis(x_scales);
	create_axis(y_scales);

}