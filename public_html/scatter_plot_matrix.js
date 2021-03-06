const MAX_DIMENSIONS = 5;
const X_NUMBER_OF_TICKS = 4;
const Y_NUMBER_OF_TICKS = 4;
const RADIUS = 4;
const COLORS = d3.schemeSet1;
const SPACE_FOR_LABELS = 0;
const AXIS_TEXT_FORMAT = (n) => n > 999 ? d3.format('.2s')(n).replace('G', 'B') : d3.format('')(n);

let xScales = [];
let yScales = [];
let xAxis = [];
let yAxis = [];

let tags = []; // actually printed dimensions
let validKeys = []; // all numeric dimensions
let nonNumericKeys = []; // all Not numeric dimensions
let nonNumericValues = [];





function createScales() {
	const X_SPACE_FOR_SINGLE_CHART = (WIDTH - PADDING * 2 - (tags.length - 1) * SPACE_BETWEEN_CHARTS) / (tags.length);
	const Y_SPACE_FOR_SINGLE_CHART = (HEIGHT - PADDING * 2 - (tags.length - 1) * VERTICAL_SPACE) / (tags.length);
	tags.forEach(dimensionName => {
		let d3MinMax = d3.extent(dataset, d => +d[dimensionName]); // min on d3MinMax[0] and max on d3MinMax[1]

		let currentXScale = d3.scaleLinear()
			.domain([d3MinMax[0], d3MinMax[1]])
			.range([0, X_SPACE_FOR_SINGLE_CHART]);

		let currentYScale = d3.scaleLinear()
			.domain([d3MinMax[1], d3MinMax[0]])
			.range([0, Y_SPACE_FOR_SINGLE_CHART]);

		xScales.push(currentXScale);
		yScales.push(currentYScale);
	});
}

function createAxis(axis) {
	if (axis == "x") {
		xScales.forEach(element => {
			xAxis.push(d3.axisBottom(element)
			.ticks(X_NUMBER_OF_TICKS)
			.tickFormat(AXIS_TEXT_FORMAT))
		});
	} else if (axis == "y") {
		yScales.forEach(element => {
			yAxis.push(d3.axisLeft(element)
			.ticks(Y_NUMBER_OF_TICKS)
			.tickFormat(AXIS_TEXT_FORMAT))
		});
	} else {
		alert("Wrong parameter in creation of axis");
	}
}

function plot(key = nonNumericKeys[0]) {
	takeValues();
	const X_SPACE_FOR_SINGLE_CHART = (WIDTH - PADDING * 2 - (tags.length - 1) * SPACE_BETWEEN_CHARTS) / (tags.length);
	const Y_SPACE_FOR_SINGLE_CHART = (HEIGHT - PADDING * 2 - (tags.length - 1) * VERTICAL_SPACE) / (tags.length);
	const SVG = d3.select("svg");
	convertDatasetToArray();
	let coord = [];

	let label = tags;
	let reverseLabel = label.slice(0,5).reverse();

	yScales.forEach((element, i) => {
		let beginningY = PADDING + i * VERTICAL_SPACE + i * Y_SPACE_FOR_SINGLE_CHART;
		xScales.forEach((innerElement, j) => {
			let beginningX = PADDING + j * SPACE_BETWEEN_CHARTS + j * X_SPACE_FOR_SINGLE_CHART+SPACE_FOR_LABELS;

			SVG.append("g")
				.attr("transform", "translate(" + beginningX + ", " + beginningY + ")")
				.call(yAxis[i])
				.attr("class", "axis" + (j != 0 ? " no_tick" : ""));

				//etichette per l'asse y
				SVG.append("text")
					.attr("transform", "translate(" + 20 + ", " + (beginningY+(0.5*Y_SPACE_FOR_SINGLE_CHART)) + "),rotate(-90)")
					.style("text-anchor", "middle")
					.attr("fill", "#635F5D")
					.text(makeReadableGlobal(tags[i].toString()));

				//etichette per l'asse x
				SVG.append("text")
					.attr("transform", "translate("
					+ (((tags.length)*X_SPACE_FOR_SINGLE_CHART) - ((tags.length-i)*X_SPACE_FOR_SINGLE_CHART) + Y_SPACE_FOR_SINGLE_CHART)
					+ ", " + (`${HEIGHT}`-20) + ")")
					.style("text-anchor", "end")
					.attr("fill", "#635F5D")
					.text(makeReadableGlobal(reverseLabel[i].toString()));

			SVG.append("g")
				.attr("transform", "translate(" + beginningX + ", " + (beginningY + Y_SPACE_FOR_SINGLE_CHART) + ")")
				.call(xAxis[tags.length - j - 1])
				.attr("class", "axis" + (i != (tags.length - 1) ? " no_tick" : ""));

			arrayDataset.forEach((row) => {
				let tempCoord = [];
				tempCoord.push(row[j]);	// x
				tempCoord.push(row[i]);	// y
				coord.push(tempCoord);
			});

		});
	});

	const BOOL_FOR_BLACK = nonNumericKeys.length <= COLORS.length

	let aux = 0;
	coord.forEach((element) => {
		const AUXILIARY_INDEX = Math.floor(aux / dataset.length);
		const X_SCALE_INDEX = AUXILIARY_INDEX % tags.length;
		const Y_SCALE_INDEX = Math.floor(AUXILIARY_INDEX / tags.length);

		const X_SCALE = xScales[X_SCALE_INDEX];
		const Y_SCALE = yScales[Y_SCALE_INDEX];


		const X = PADDING
			+ X_SCALE(element[0])
			+ (tags.length - 1) * SPACE_BETWEEN_CHARTS
			+ (tags.length - 1) * X_SPACE_FOR_SINGLE_CHART
			- X_SCALE_INDEX * SPACE_BETWEEN_CHARTS
			- X_SCALE_INDEX * X_SPACE_FOR_SINGLE_CHART;

		const Y = PADDING
			+ Y_SCALE(element[1])
			+ Y_SCALE_INDEX * VERTICAL_SPACE
			+ Y_SCALE_INDEX * Y_SPACE_FOR_SINGLE_CHART;

		let color;

		if (BOOL_FOR_BLACK && nonNumericKeys.includes(key)) {
			const DATASET_INDEX = aux - AUXILIARY_INDEX * dataset.length;
			const SINGLE_ELEMENT = dataset[DATASET_INDEX];
			const SINGLE_KEY_VALUE = `${SINGLE_ELEMENT[key]}`
			let keyPosition = nonNumericKeys.indexOf(key);
			let values = nonNumericValues[keyPosition];
			color = COLORS[values.indexOf(SINGLE_KEY_VALUE)];
		} else {
			color = "black";
		}

		let toString = objToString(dataset[aux%dataset.length]);

		SVG.append("circle")
			.attr("cx", X)
			.attr("cy", Y)
			.attr("r", RADIUS)
			.attr("class", "dot")
			.attr("fill", color)
			.attr("opacity", .4)
		.append("svg:title")
			.text(toString);

		aux++;
	})
}

function objToString (obj) {
    var str = '';
     for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ': ' + obj[p] + "\n";
        }
    }
    return str;
}
function colorDimension(value) {
	for (key in dataset[0]) {
		if (key == value) {
			let auxData = dataset[0]
			if (!isNaN(parseFloat(`${auxData[key]}`))) {
				alert("You have to select a non numeric key.");
			} else {
				nonNumericValues = [];
				dataset.forEach((element) => {
					if (nonNumericValues.indexOf(`${element[key]}`) == -1) {
						nonNumericValues.push(`${element[key]}`);
					}
				});
				if (COLORS.length > nonNumericValues.length) {
					d3.select("svg").selectAll("circle").remove()
					plot(key)
				}
			}
		}
	}
}

function isDatasetEmpty(dataset) {
	if (dataset.length == 0) {
		alert("Dataset empty");
		return true;
	}
	return false;
}

function injectSelectionInHTML(element, nonNumericKeys) {
	element.innerHTML += `
		<hr>
		<span class="menu-label">Color a dimension:</span>
		<div class="custom-select" style="WIDTH:200px; height:50px">
			<select id="color_selection" onchange='colorDimension(value, selectedIndex)'>`;
	const SELECT = document.getElementById("color_selection");
	nonNumericKeys.forEach((element) => {
		SELECT.innerHTML += `<option value = '${element}'> ${element}</option>`
	});
	element.innerHTML += `
			</select>
		</div>`;

	customSelectMenu();
}

function checkDimensionNumber(obj, checked) {
	if (checked && tags.length === MAX_DIMENSIONS) {
			obj.checked = false;
			alert("Max amount of dimensions limit reached");

			return false;
	}
	return true;
}

function adaptScatterPlot(obj, checked) {
	if (checkDimensionNumber(obj, checked)) {
		if (checked) {
			tags.push(obj.value);
		} else {
			tags = tags.filter(nameDimension => nameDimension != obj.value);
		}

		d3.select("svg").selectAll("*").remove();
		xScales = [];
		yScales = [];
		xAxis = [];
		yAxis = [];
		xScales = [];
		yScales = [];

		run();
	}
}

function drawScatterPlot(dataset) {
	if (!isDatasetEmpty(dataset)) {
		let start = performance.now()
		clearAll();

		const element = document.getElementById("dimensionSelection");
		const auxData = dataset[0];
		const keys = Object.keys(auxData);

		keys.forEach(element => {
			if (!isNaN(+(auxData[element]))) {
				validKeys.push(element);
			}
		});

		for (key in auxData) {
			if (!validKeys.includes(key) && isNaN(+(auxData[element]))) {
				nonNumericKeys.push(key);
			}
		}

		takeValues();

		element.innerHTML += `<h2>MENU</h2>
		<hr>
		<span class="menu-label">Dimension plotted:</span>`
		validKeys.forEach(key => {
			if (tags.length < MAX_DIMENSIONS) {
				tags.push(key); // printed dimensions
			}
			element.innerHTML += `
				<label class="checkbox-container" for='${key}'> ` + makeReadable({ key })
					+ `<input id='${key}' type='checkbox' name='${key}'` + ((tags.includes(key)) ? "checked" : "")
					+ ` onchange = 'adaptScatterPlot(this, checked)' value='${key}'/>
					<span class="checkmark"></span>
				</label>`;
		});

		injectSelectionInHTML(element, nonNumericKeys);

		run();

		let end = performance.now();
		console.log(`Execution time: ${((end - start) / 1000).toFixed(2)} seconds`);
	} else {
		alert("Empty dataset!")
	}
}

function run() {
	createScales(); // ??
	createAxis("x"); // ??
	createAxis("y"); // ??
	plot();
}

// custom select menu from w3c
function customSelectMenu() {
	var x, i, j, l, ll, selElmnt, a, b, c;
		/*look for any elements with the class "custom-select":*/
		x = document.getElementsByClassName("custom-select");
		l = x.length;
		for (i = 0; i < l; i++) {
		  selElmnt = x[i].getElementsByTagName("select")[0];
		  ll = selElmnt.length;
		  /*for each element, create a new DIV that will act as the selected item:*/
		  a = document.createElement("DIV");
		  a.setAttribute("class", "select-selected");
		  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
		  x[i].appendChild(a);
		  /*for each element, create a new DIV that will contain the option list:*/
		  b = document.createElement("DIV");
		  b.setAttribute("class", "select-items select-hide");
		  for (j = 1; j < ll; j++) {
			/*for each option in the original select element,
			create a new DIV that will act as an option item:*/
			c = document.createElement("DIV");
			c.innerHTML = selElmnt.options[j].innerHTML;
			c.addEventListener("click", function(e) {
				/*when an item is clicked, update the original select box,
				and the selected item:*/
				var y, i, k, s, h, sl, yl;
				s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				sl = s.length;
				h = this.parentNode.previousSibling;
				for (i = 0; i < sl; i++) {
				  if (s.options[i].innerHTML == this.innerHTML) {
					s.selectedIndex = i;
					h.innerHTML = this.innerHTML;
					y = this.parentNode.getElementsByClassName("same-as-selected");
					yl = y.length;
					for (k = 0; k < yl; k++) {
					  y[k].removeAttribute("class");
					}
					this.setAttribute("class", "same-as-selected");
					this.setAttribute("onchange", colorDimension(this.innerText));
					break;
				  }
				}
				h.click();
			});
			b.appendChild(c);
		  }
		  x[i].appendChild(b);
		  a.addEventListener("click", function(e) {
			  /*when the select box is clicked, close any other select boxes,
			  and open/close the current select box:*/
			  e.stopPropagation();
			  closeAllSelect(this);
			  this.nextSibling.classList.toggle("select-hide");
			  this.classList.toggle("select-arrow-active");
			});
		}
		function closeAllSelect(elmnt) {
		  /*a function that will close all select boxes in the document,
		  except the current select box:*/
		  var x, y, i, xl, yl, arrNo = [];
		  x = document.getElementsByClassName("select-items");
		  y = document.getElementsByClassName("select-selected");
		  xl = x.length;
		  yl = y.length;
		  for (i = 0; i < yl; i++) {
			if (elmnt == y[i]) {
			  arrNo.push(i)
			} else {
			  y[i].classList.remove("select-arrow-active");
			}
		  }
		  for (i = 0; i < xl; i++) {
			if (arrNo.indexOf(i)) {
			  x[i].classList.add("select-hide");
			}
		  }
		}
		/*if the user clicks anywhere outside the select box,
		then close all select boxes:*/
		document.addEventListener("click", closeAllSelect);
}
