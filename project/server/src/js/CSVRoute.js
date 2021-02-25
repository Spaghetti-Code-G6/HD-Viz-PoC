
import Router from 'express';
import uploader from 'express-fileupload';

import fs from 'fs';
import readLine from 'readline'

/** Handle di route per la gestione dei CSV*/
let CSVRouter = Router()


/** Utilizzo di uploader con configurazione di limiti.*/
CSVRouter.use(uploader({
        /** Limite in dimensione del file caricato.*/
        limits : { fileSize: 500 * 1048576 },

        /** Uso di file temporanei. s*/
        useTempFiles : true,
        tempFileDir: 'server/csv/tmp/',
        /* Non so cosa faccia questo.*/
        debug : false
}));

CSVRouter.get('/', (req, res) => {
    res.send('Hello There')
})


CSVRouter.post('/upload', async (req,res) =>{

    /* Caricato con successo il file.*/
    if(req.files){

        /** Controllo formato.*/
        const fileName = req.files.csvFile.name;
        console.log(fileName.slice(fileName.length - 4))

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
                metadata[i] = {
                    [header[i].replaceAll("\"", "")]
                    : !isNaN(+types[i])  ? typeof  +types[i] : typeof types[i], visibility: true
                };
            }

            console.log(metadata)

            /** @return Object{ url : path, meta : Object of Metadata }*/
            res.send({ url: req.files.csvFile.tempFilePath, meta: metadata });

        }
    } else
        /* Gestione errore va qui.
        ( Oggetto vuoto che mandato il front-end riconosce essere vuoto ?)*/
        res.send('Errore')

})

/** @param {number} limit: Righe che si vogliono estrarre a partire da 0.
 *  @param {string} path: Percorso del file.
 *  @return {Promise} : Righe lette e salvate.*/
function read(limit, path){

    const readStream = readLine.createInterface({ input: fs.createReadStream(path)})

    return new Promise(((resolve, reject) => {

        let readLines = [];
        let counter = 0;

        readStream.on("line", chunk => {
            counter ++; readLines.push(chunk); console.log(counter);
            // Non so perché ma mi controlla tutte le righe. Probabilmente entra in esecuzione prima della chiusura.
            if(counter === limit) readStream.close();

        });
        readStream.on("close", () => resolve(readLines));
        readStream.on("error", error => reject(error));

    }));
}

export const garbageCollector = setInterval( ()=> {
    fs.rmdir('server/csv/tmp/', {recursive : true}, ()=>{
        fs.mkdir('server/csv/tmp', ()=> console.log('Deleted temp files.'))})}, 1000 * 3600)

export default CSVRouter;

