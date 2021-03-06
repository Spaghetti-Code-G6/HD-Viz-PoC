
let configs = [];

function getAll (){

    fetch('/available', {
        method : 'POST', headers: {'Content-Type': 'application/json'}
    }).then(res => res.json()).then( data => {
        console.log(data)
        let element = document.getElementById('dbForm');
        data.options.forEach( dat => /** Aggiunta di selezioni*/
            element.innerHTML += '<input id="'+ dat.index +'" type="button" value="test" onClick="doSelection(this.id)">'
                + dat.name + ' ' + dat.description + '</input>')
    })

}

function doSelection(id){

    fetch('/selected', {
        method : 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ selectedConfig: id })
    }).then(res => res.json()).then(res => {
        dataset = res.data;
        drawScatterPlot(res.data)
    })

}