let array_dataset = [];

function make_readable(str){

	//TODO: Migliorarle
	let aux = str.key.replace("_", " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);

	return aux;
}

function clear_all(){

	x_scales = [];
	y_scales = [];
	tags = [];
	x_axis = [];
	y_axis = [];
	indexes = [];
	array_dataset = [];
	valid_keys = [];
	non_numeric_keys = [];
	non_numeric_values = [];
	document.getElementById("dimensionSelection").innerHTML = "";
	d3.select("svg").selectAll("*").remove();
}

function convert_dataset_to_array(){

	array_dataset = [];
	//console.log("converting")
	//console.log(valid_keys)
	
	dataset.forEach((element)=> {

		let temp_array = [];
		for(key in element){

			if(valid_keys.indexOf(key) != -1){

				temp_array.push(parseFloat(`${element[key]}`));
			}
		}
		array_dataset.push(temp_array);
	});

	//console.log(array_dataset);

	//console.log(Object.values(dataset[0]));

}