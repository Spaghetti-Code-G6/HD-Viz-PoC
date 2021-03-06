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

function takeValues() {

	let j = 0;
	const aux_data = dataset[0];
	non_numeric_values = [];
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

}

function clearAll() {
	x_scales = [];
	y_scales = [];
	tags = [];
	x_axis = [];
	y_axis = [];
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
			if (tags.includes(key)) {
				temp_array[tags.indexOf(key)] = (+(element[key]));
			}
		}
		array_dataset.push(temp_array);
	});
}