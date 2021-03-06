let arrayDataset = [];

function makeReadable(str) {
	let aux = str.key.replace("_", " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);
	return aux;
}


/*input: string $str
output: a copy of $str with all "_" characters escaped*/
function makeReadableGlobal(str) {
	let aux = str.replace(/_/g, " ");
	aux = aux.charAt(0).toUpperCase() + aux.slice(1);
	return aux;
}

function takeValues(){

	let j = 0;
	const AUX_DATA = dataset[0];
	nonNumericValues = [];
	for (key in AUX_DATA) {
		let aux = [];
		dataset.forEach((element) => {
			if ((validKeys.indexOf(key) == -1) && (aux.indexOf(`${element[key]}`) == -1)) {
				aux.push(`${element[key]}`); // ??
			}
		})
		j++;
		if (aux.length != 0) {
			nonNumericValues.push(aux);
		}
	}

}

function clearAll() {
	xScales = [];
	yScales = [];
	tags = [];
	xAxis = [];
	yAxis = [];
	arrayDataset = [];
	validKeys = [];
	nonNumericKeys = [];
	nonNumericValues = [];
	document.getElementById("dimensionSelection").innerHTML = "";
	d3.select("svg").selectAll("*").remove();
}

function convertDatasetToArray() {
	arrayDataset = [];

	dataset.forEach((element) => {
		let tempArray = [];
		for (key in element) {
			if (tags.includes(key)) {
				tempArray[tags.indexOf(key)] = (+(element[key]));
			}
		}
		arrayDataset.push(tempArray);
	});
}
