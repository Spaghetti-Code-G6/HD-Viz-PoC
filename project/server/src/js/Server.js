/**
 *  csvConverted : {
 *      headers : [{
 *          nomeCampo : tipo
 *          visibility : true/false
 *
 *      }, {
 *          nomeCampo : tipo
 *          visibility : true/false
 *      }]
 *      data : [
 *          { Campo : valore ... }
 *          { Campo : valore ... }
 *          { Campo : valore ... }
 *      ];
 *  }
 * **/

import express from 'express'

const CSVtoJSON =require("csvtojson");

const path = require('path');

const upload = require("express-fileupload");
const fs = require("fs");

let port = 8085;
let app = express()

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'build')));

app.use(upload())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/game', (req, res)=>{
    res.send('Hello there')
})

app.get('/game/fileload', ((req, res) => {
    res.sendFile('CSVForm.html', { root : __dirname})
}))

app.post('/newFile', (async (req, res) => {

    const csvFile = req.files.csvFile.data.toString('utf8');

    let metadata = [];

    let types = csvFile.split('\n')[1].split(',');
    let header = csvFile.split('\n')[0].split(',');

    for(let i = 0; i < header.length ; i++){
        // JSON contenente array di oggetti.
        metadata[i] = {/** Creazione di header di metadata.*/
            [header[i].replaceAll("\"", "")]:
                !isNaN(+types[i]) ? typeof +types[i] : typeof types[i],
            visibility: true
        };
    }
    /** Remove return and merge two jsons.*/
    const csvData = await CSVtoJSON().fromString(csvFile).then(json => {return { data: json }})
    res.json({metadata, ...csvData})

}))

/**
 *  sqlConfigurations/
 *      connection_name.sql
 *      connection_name.config
 *
 *      connection_name.sql
 *      connection_name.config
 *
 *      connection_name.sql
 *      connection_name.config
 * */

app.get('/db/list', ((req, res) => {

    let conf = []
    configList.forEach((elem) => {

        let rawData = fs.readFileSync('sqlConfigurations/' + elem, 'utf-8')
        conf.push(JSON.parse(rawData))

    })

    res.body = conf
    res.send(conf)

}))

app.post('/dbAccess', (req, res) => {
    /** Accesso al db dato.*/
    console.log(req.body.password)
    if( req && req.body.inputAddress != null && req.body.dbName != null && req.body.dbPsw && req.body.dbUserName != null){

        console.log("Credentials sent.")

    } else {
        res.body.error = true;
        console.log("Errore di connessione")
    }
})

app.get('/graph',((req, res, next) => {

}))

app.listen(port)