
    import {drawScatterPlotMatrix} from '/src/js/ScatterPlot.js';

    /** Global ? */
    export let dataset = [];
    export let metadata = [];

    const width = 1300; const height = 850;
    /** Proprietà di display */
    const padding = 30;const chartSpace = 15;const vSpace = 10;

    function main() {

        const svg = d3.select("#scatter_plot_content").append("svg").attr("width", width).attr("height", height);

    }

    export function sendData(){

        let file = document.getElementById("csvFile").files[0];
        const formData = new FormData();

        formData.append('csvFile', file);

        const options = { method: 'POST', body: formData };

        fetch('/csv/upload', options)
            .then(response=> response.json())
            .then(json => {
                dataset = []; metadata = json.meta;
                d3.csv('../../' + json.url, (data) => dataset = data).then(drawScatterPlotMatrix(dataset));
            });
    }

