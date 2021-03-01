
    import {drawScatterPlotMatrix} from '/public/src/js/ScatterPlot.js';

    /** Global ? */
    export let dataset = [];
    export let metadata = [];

    const width = 1300; const height = 850;
    /** Proprietà di display */
    const padding = 30;const chartSpace = 15;const vSpace = 10;

    function main() {

        const svg = d3.select("#scatter_plot_content").append("svg").attr("width", width).attr("height", height);

    }

    export function createWindow() {

        fetch('/session', {method: 'GET'})
            .then(response => response.json())
            .then(data => {

                /** Se abbiamo già creato quindi un grafico o importato dati.*/
                if(data.meta) {
                    metadata = data.meta

                    if(data.src && data.src === 'csv') /** La fonte del grafico precedente è csv.*/
                        /** @deprecated: Ora fa il disegno dello scatter plot ma prossimamente passeremo
                         *  il parametro grafico del tipo selezionato da utente (se selezionato)*/
                        d3.csv('../../../' + data.url, (data) => dataset = data).then(drawScatterPlotMatrix(dataset));

                    else if(data.src && data.src  === 'db') {
                        console.log('SQL bip bup grafico bip')
                    }
                } else {
                    /** Redirect a caricamento csv (solo per ora, più avanti semplicemente si avrà display
                     *  delle fonti che si possono selezionare e poi collegamento ad esse.*/
                    window.location.replace('/public/src/html/csv_load.html')

                }
            })


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
                d3.csv('../../../' + json.url, (data) => dataset = data).then(drawScatterPlotMatrix(dataset));
            });
    }



