import express from 'express'
/** Middle-ware per la gestione dell upload dei file.*/
import uploader from 'express-fileupload'

import fs from 'fs'
import readLine from 'readline'
/** Gestore della sessione.*/
import {
    setSession
} from '../components/sessionManager.js'

let csvRouter = express.Router()

/** Utilizzo di uploader con configurazione di limiti.*/
csvRouter.use(uploader({

    limits: {
        fileSize: 500 * 1048576
    },
    /** Limite in dimensione del file caricato.*/

    useTempFiles: true,
    tempFileDir: 'server/csv/tmp/'

}));

/** Effettua il caricamento del csv e il reperimento dei dati interessati alla creazione del grafico, istanziando
 *  i parametri della sessione corrente in modo da poter gestire perdite di connessioni.*/
csvRouter.post('/file', async (req, res) => {

    if (req.files) {
        /* Caricato con successo il file.*/
        if (checkCsv(req.files.csvFile.name)) {

            const firstLines = await read(2, req.files.csvFile.tempFilePath);
            /* Riga di testa e prima riga di record divisi per campo.*/
            if (firstLines.length > 1) {

                firstLines[0] = firstLines[0].split(',');
                firstLines[1] = firstLines[1].split(',');

                let metaData = {};
                for (let i = 0; i < firstLines[0].length; i++) {

                    metaData[firstLines[0][i]] = {
                        visibility: true,
                        /* Nome campo, visibilità e tipo.*/
                        type: !isNaN(+firstLines[1][i]) ? typeof + firstLines[1][i] : typeof firstLines[1][i],
                    }

                }
                /** Settaggio corretto della sessione corrente.*/
                await setSession(req, 'csv', metaData, req.files.csvFile.tempFilePath);
                res.send({
                    url: await req.files.csvFile.tempFilePath,
                    metadata: metaData
                })
            } else {
                res.send({
                    err: 'Errore nella dimensione del file'
                });
            }
        } else res.send({
            err: 'Errore in formato file.'
        })
    }
})

function checkCsv(fileName) {
    return fileName.substr(fileName.length - 4) === '.csv';
}


/** @param  limit : number Righe che si vogliono estrarre a partire da 0.
 *  @param  path : String Percorso del file.
 *  @return {Promise<Array>} : Righe lette e salvate.*/
function read(limit, path) {

    const readStream = readLine.createInterface({
        input: fs.createReadStream(path)
    })
    return new Promise(((resolve, reject) => {

        let readLines = [];
        let counter = 0;

        readStream.on("line", chunk => {
            counter++;
            readLines.push(chunk);
            // Non so perché ma mi controlla tutte le righe. Probabilmente entra in esecuzione prima della chiusura.
            if (counter === limit) readStream.close();
        });

        readStream.on("close", () => resolve(readLines));
        /** Restituisce il valore di promessa*/
        readStream.on("error", error => reject(error)); /** Manda errore, da gestire.*/
    }));
}

export default csvRouter;