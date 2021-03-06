let x_scales = [];
let y_scales = [];
let x_axis = [];
let y_axis = [];

let tags = []; // actually printed dimensions
let valid_keys = []; // all numeric dimensions
let non_numeric_keys = []; // all Not numeric dimensions
let non_numeric_values = [];

const max_dimensions = 5;
const x_number_of_ticks = 4;
const y_number_of_ticks = 4;
const radius = 4;
const colors = d3.schemeSet1;
const SPACE_FOR_LABELS = 0;

const axisTextFormat = (n) => n > 999 ? d3.format('.2s')(n).replace('G', 'B') : d3.format('')(n);

function createScales() {
    const xSpaceForSingleChart = (width - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length);
    const ySpaceForSingleChart = (heigth - padding * 2 - (tags.length - 1) * vertical_space) / (tags.length);
    tags.forEach(dimensionName => {
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

function createAxis(axis) {
    if (axis == "x") {
        x_scales.forEach(element => {
            x_axis.push(d3.axisBottom(element)
                .ticks(x_number_of_ticks)
                .tickFormat(axisTextFormat))
        });
    } else if (axis == "y") {
        y_scales.forEach(element => {
            y_axis.push(d3.axisLeft(element)
                .ticks(y_number_of_ticks)
                .tickFormat(axisTextFormat))
        });
    } else {
        alert("Wrong parameter in creation of axis");
    }
}

function plot(key = non_numeric_keys[0]) {
    takeValues();
    const xSpaceForSingleChart = (width - padding * 2 - (tags.length - 1) * space_between_charts) / (tags.length);
    const ySpaceForSingleChart = (heigth - padding * 2 - (tags.length - 1) * vertical_space) / (tags.length);
    const svg = d3.select("svg");
    convertDatasetToArray();
    let coord = [];

    let label = tags;
    let reverse_label = label.slice(0, 5).reverse();

    y_scales.forEach((element, i) => {
        let beginning_y = padding + i * vertical_space + i * ySpaceForSingleChart;
        x_scales.forEach((inner_element, j) => {
            let beginning_x = padding + j * space_between_charts + j * xSpaceForSingleChart + SPACE_FOR_LABELS;

            svg.append("g")
                .attr("transform", "translate(" + beginning_x + ", " + beginning_y + ")")
                .call(y_axis[i])
                .attr("class", "axis" + (j != 0 ? " no_tick" : ""));

            //etichette per l'asse y
            svg.append("text")
                .attr("transform", "translate(" + 20 + ", " + (beginning_y + (0.5 * ySpaceForSingleChart)) + "),rotate(-90)")
                .style("text-anchor", "middle")
                .attr("fill", "#635F5D")
                .text(makeReadableGlobal(tags[i].toString()));

            //etichette per l'asse x
            svg.append("text")
                .attr("transform", "translate("
                    + (((tags.length) * xSpaceForSingleChart) - ((tags.length - i) * xSpaceForSingleChart) + ySpaceForSingleChart)
                    + ", " + (`${heigth}` - 20) + ")")
                .style("text-anchor", "end")
                .attr("fill", "#635F5D")
                .text(makeReadableGlobal(reverse_label[i].toString()));

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

        let toString = objToString(dataset[aux % dataset.length]);

        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", radius)
            .attr("class", "dot")
            .attr("fill", color)
            .attr("opacity", .4)
            .append("svg:title")
            .text(toString);

        aux++;
    })
}

function objToString(obj) {
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
            let aux_data = dataset[0]
            if (!isNaN(parseFloat(`${aux_data[key]}`))) {
                alert("You have to select a non numeric key.");
            } else {
                non_numeric_values = [];
                dataset.forEach((element) => {
                    if (non_numeric_values.indexOf(`${element[key]}`) == -1) {
                        non_numeric_values.push(`${element[key]}`);
                    }
                });
                if (colors.length > non_numeric_values.length) {
                    d3.select("svg").selectAll("circle").remove()
                    plot(key)
                }
            }
        }
    }
}

function isDatasetEmpty(dataset) {
    if (dataset.length === 0) {
        alert("Dataset empty");
        return true;
    }
    return false;
}

function injectSelectionInHTML(element, non_numeric_keys) {
    element.innerHTML += `
		<hr>
		<span class="menu-label">Colora una dimensione:</span>
		<div class="custom-select" style="width:200px; height:50px">
			<select id="color_selection" onchange='colorDimension(value, selectedIndex)'>`;
    const select = document.getElementById("color_selection");
    non_numeric_keys.forEach((element) => {
        select.innerHTML += `<option value = '${element}'> ${element}</option>`
    });
    element.innerHTML += `
			</select>
		</div>`;

    /** Problema: Custom select non considera la possibilità avere una lista vuota.*/
    customSelectMenu();
}

function checkDimensionNumber(obj, checked) {
    let number_of_checked = 0;

    if (checked && tags.length === max_dimensions) {

        obj.checked = false;
        alert("Raggiounto numero massimo di dimensioni stampabili.");
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
        x_scales = [];
        y_scales = [];
        x_axis = [];
        y_axis = [];
        x_scales = [];
        y_scales = [];

        run();
    }
}

function drawScatterPlot(dataset) {
    if (!isDatasetEmpty(dataset)) {
        let start = performance.now()
        clearAll();

        const element = document.getElementById("dimensionSelection");
        const aux_data = dataset[0];
        const keys = Object.keys(aux_data);

        keys.forEach(element => {
            if (!isNaN(+(aux_data[element]))) {
                valid_keys.push(element);
            }
        });

        for (key in aux_data) {
            if (!valid_keys.includes(key) && isNaN(+(aux_data[element]))) {
                non_numeric_keys.push(key);
            }
        }

        takeValues();

        element.innerHTML += `<h2>MENU</h2>
		<hr>
		<span class="menu-label">Dimensioni stampate:</span>`
        valid_keys.forEach(key => {
            if (tags.length < max_dimensions) {
                tags.push(key); // printed dimensions
            }
            element.innerHTML += `
				<label class="checkbox-container" for='${key}'> ` + makeReadable({key})
                + `<input id='${key}' type='checkbox' name='${key}'` + ((tags.includes(key)) ? "checked" : "")
                + ` onchange = 'adaptScatterPlot(this, checked)' value='${key}'/>
					<span class="checkmark"></span>
				</label>`;
        });

        injectSelectionInHTML(element, non_numeric_keys);

        run();

        let end = performance.now();
        console.log(`Execution time: ${((end - start) / 1000).toFixed(2)} seconds`);
    } else {
        alert("dataset empty!!!")
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

    /** @deprecated: soluzione temporanea al fatto che crei la selezione per elementi vuoti*/
    if (x[0].getElementsByTagName("select")[0].innerHTML === "") return;

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
            c.addEventListener("click", function (e) {
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
        a.addEventListener("click", function (e) {
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