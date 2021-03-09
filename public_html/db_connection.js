let configs = [];

function getAll() {

    fetch('/available', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        let element = document.getElementById('dbForm');
        data.options.forEach(dat => {
            /** Aggiunta di selezioni*/
            configs.push(dat)
            element.innerHTML +=
                '<div class="db-sel">' +
                '<h3>' + dat.name + '</h3>' +
                '<span class="dat-description"> ' + dat.description + '</span>' +
                '<input id="' + dat.index + '" type="button" value="Carica" onClick="doSelection(this.id)">' +
                '</div>'
        })
    })

}

function doSelection(id) {

    fetch('/selected', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            selectedConfig: id
        })
    }).then(res => res.json()).then(res => {
        dataset = res.data
        drawScatterPlot(res.data)
    })

}