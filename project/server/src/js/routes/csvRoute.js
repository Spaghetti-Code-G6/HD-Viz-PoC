import express from 'express'

/** Middle-ware per la gestione dell upload dei file.*/
import uploader from 'express-fileupload'

import fs from 'fs'
import readLine from 'readline'

import stream from 'stream'

let csvRouter = express.Router()

/** Gestore della sessione.*/
import {setSession, deleteBuffer}  from '../components/sessionManager.js'

/** Utilizzo di uploader con configurazione di limiti.*/
csvRouter.use(uploader({

    limits : { fileSize: 500 * 1048576 }, /** Limite in dimensione del file caricato.*/

    useTempFiles : true,
    tempFileDir: 'server/csv/tmp/'

}));

/** Effettua il caricamento del csv e il reperimento dei dati interessati alla creazione del grafico, istanziando
 *  i parametri della sessione corrente in modo da poter gestire perdite di connessioni.*/
csvRouter.post('/upload', async (req, res) =>{

    if(!req.files) res.send('Errore nell invio del file.');

    /* Caricato con successo il file.*/
    const fileName = req.files.csvFile.name;
    if (checkCsv(fileName)) {

        let metaData = [];

        const firstLines = await read(2, req.files.csvFile.tempFilePath);

        firstLines[0] = firstLines[0].split(',');
        firstLines[1] = firstLines[1].split(',');

        for (let i = 0; i < firstLines[0].length; i++) {

            metaData[i] = { /** Entry di metadata per ogni campo di tipo del nostro file csv.*/
                header: firstLines[0][i], visibility: true, /* Nome campo, visibilità e tipo.*/
                type: !isNaN(+firstLines[1][i]) ? typeof +firstLines[1][i] : typeof firstLines[1][i],
            }
        }
        /** Settaggio corretto della sessione corrente.*/
        req.session = setSession(req.session, 'csv', metaData, req.files.csvFile.tempFilePath);
        res.send({url: req.files.tempFilePath, meta: metaData})
    } else {res.send({err:'Errore in formato file.'});}
})

function checkCsv(fileName) { return fileName.substr(fileName.length - 4) === '.csv'; }


/** @param {number} limit: Righe che si vogliono estrarre a partire da 0.
 *  @param {string} path: Percorso del file.
 *  @return {Promise} : Righe lette e salvate.*/
function read(limit, path){

    const readStream = readLine.createInterface({ input: fs.createReadStream(path)})

    return new Promise(((resolve, reject) => {

        let readLines = [];
        let counter = 0;

        readStream.on("line", chunk => {
            counter ++; readLines.push(chunk);
            // Non so perché ma mi controlla tutte le righe. Probabilmente entra in esecuzione prima della chiusura.
            if(counter === limit)  readStream.close(); });

        readStream.on("close", () => resolve(readLines)); /** Restituisce il valore di promessa*/
        readStream.on("error", error => reject(error)); /** Manda errore, da gestire.*/

    }));
}

export default csvRouter;

