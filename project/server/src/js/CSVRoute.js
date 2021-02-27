
import Router from 'express'
import uploader from 'express-fileupload'

import fs from 'fs'
import readLine from 'readline'

import stream from 'stream'

/** Crea lista di iscrizione all elenco di sessioni da CSV, importante per mantenere in memoria i file
 *  temporanei delle sessioni ancora in corso.*/
import subscriptionList from './subscriptionList.js'


let CSVRouter = Router()

/** Utilizzo di uploader con configurazione di limiti.*/
CSVRouter.use(uploader({
        /** Limite in dimensione del file caricato.*/
        limits : { fileSize: 500 * 1048576 },
        /** Uso di file temporanei. s*/
        useTempFiles : true,
        tempFileDir: 'server/csv/tmp/',
}));

CSVRouter.post('/upload', async (req,res) =>{
    /** TODO: Sistemare per sessione.*/
    /* Caricato con successo il file.*/
    if(req.files){
        /** Controllo formato.*/
        const fileName = req.files.csvFile.name;
        /** Check the format of the given file.*/
        if(fileName.substr(fileName.length - 4) === '.csv'){

            console.log('File valid.');
            /** Creazione metadati*/
            let metadata = []

            /* Le prime due righe del file.*/
            const firstLines = await read(2, req.files.csvFile.tempFilePath);

            /** Header e tipi.*/
            let header = firstLines[0].split(',')
            let types = firstLines[1].split(',')

            for(let i = 0; i < header.length; i++){
                metadata[i] = { /** Struttura dei metadati. header (nome campo), tipo (numeric/string), visibilità.*/
                    header : header[i].replaceAll("\"", ""),
                    type: !isNaN(+types[i])  ? typeof  +types[i] : typeof types[i], visible: true };
            }

            /* TODO: Fare come si deve, ora testavo e basta.*/
            /** Metadata di sessione.*/
            req.session.hdVizId = subscriptionList.add(fileName);
            if(req.session.hdVizId > - 1) {
                req.session.metadata = metadata;
                req.session.sourceFile = fileName;
                req.session.sourceType = 'csv';
            } else { req.session.destroy(); }

            /** @return Object{ url : {String}, meta : {Object} }*/
            res.send({ url: req.files.csvFile.tempFilePath, meta: metadata });
        }
    } else  res.send('Errore')
        /* Gestione errore va qui.
        ( Oggetto vuoto che mandato il front-end riconosce essere vuoto ?)*/
})

/** @param {number} limit: Righe che si vogliono estrarre a partire da 0.
 *  @param {string} path: Percorso del file.
 *  @return {Promise} : Righe lette e salvate.*/
function read(limit, path){

    const readStream = readLine.createInterface({ input: fs.createReadStream(path)})

    return new Promise(((resolve, reject) => {
        /** Variabili di appoggio. */
        let readLines = []; let counter = 0;

        readStream.on("line", chunk => {
            counter ++; readLines.push(chunk);
            // Non so perché ma mi controlla tutte le righe. Probabilmente entra in esecuzione prima della chiusura.
            if(counter === limit) readStream.close();

        });
        readStream.on("close", () => resolve(readLines)); /** Restituisce il valore di promessa*/
        readStream.on("error", error => reject(error)); /** Manda errore, da gestire.*/

    }));
}

/** Gestione degli elementi temporanei con stream. Più semplice da comprendere. Ad intervalli crea uno stream dall array
 *  di elementi da eliminare e li elimina in modo asincrono.*/
const streamGarbageCollector =  setInterval(() => {

    /** @type {String} filePath: Percorso dei file temporanei.*/
    const filePath = 'server/csv/tmp/';
    /** Limite di sessioni da CSV apribili allo stesso tempo.*/
    const limit = 10;

    if(subscriptionList.length > limit)
        new stream.Readable.from(subscriptionList.purge(limit/2))
            .on('data',(chunk)=> fs.unlink(filePath + chunk, err =>{if(err) console.log(err)}))
            .on('end', () => console.log('Finita eliminazione'))
            .on('error',(err)=> console.log('err : '+ err));
}, 30*100) /* Intervallo di ripetizione.*/

export default CSVRouter;
