let array_dataset = [];

function makeReadable(str) {
	// TODO: Migliorarle
	let aux = str.key.replace("_", " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);
	return aux;
}

/*Prende in input una stringa $str, rimuove tutti i caratteri _ e la ritona.
l'ho scritta perchè non capisco lo scopo di str.key della makeReadable originale
che però non cancello perchè qui sono la persona meno qualificata per farlo*/
function makeReadableGlobal(str) {
	let aux = str.replace(/_/g, " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);
	return aux;
}

function clearAll() {
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

function convertDatasetToArray() {
	array_dataset = [];

	dataset.forEach((element) => {
		let temp_array = [];
		for (key in element) {
			if (valid_keys.indexOf(key) != -1) {
				temp_array.push(parseFloat(`${element[key]}`));
			}
		}
		array_dataset.push(temp_array);
	});
}
