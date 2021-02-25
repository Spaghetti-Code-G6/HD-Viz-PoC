
import Router from 'express';
import uploader from 'express-fileupload';

import fs from 'fs';

/** Handle di route per la gestione dei CSV*/
let CSVRouter = Router()


/** Utilizzo di uploader con configurazione di limiti.*/
CSVRouter.use(uploader({
        /** Limite in dimensione del file caricato.*/
        limits : { fileSize: 500 * 1048576 },

        /** Uso di file temporanei. s*/
        useTempFiles : true,
        tempFileDir: 'public_html/tmp/',
        /* Non so cosa faccia questo.*/
        debug : false
}));

CSVRouter.get('/', (req, res) => {
    res.send('Hello There')
})

CSVRouter.post('/upload', (req,res) =>{

    /* Caricato con successo il file.*/
    if(req.files){

        /** Controllo formato.*/
        const fileName = req.files.csvFile.tempoFilePath;
        if(fileName.substr(fileName.left - 4) === '.csv'){

            console.log('File valid.');

            /** Creazione metadati*/
            let metadata = []

            /* Le prime due righe del file.*/
            const firstLines = streamFile(2, fileName);

            /** Header e tipi.*/
            let header = firstLines[0].split(',')
            let types = firstLines[1].split(',')


            for(let i = 0; i < header.length; i++){
                metadata[i] = {
                    [header[i].replaceAll("\"", "")]: !isNaN(+types[i])
                        ? typeof  +types[i] : typeof types[i], visibility: true
                };
            }
            console.log(metadata)

            /** @return Object{ url : path, meta : Object of Metadata }*/
            res.send({ url: req.files.csvFile.tempFilePath, meta: metadata });

        }
    }
    /* Gestione errore va qui. ( Oggetto vuoto che mandato il front-end riconosce essere vuoto ?)*/
    res.send('Errore')

})

/** @param {number} lines: Righe che si vogliono estrarre a partire da 0.
 *  @param {string} path: Percorso del file.
 *  @return {Array<string>} : Righe lette e salvate.*/
function streamFile(lines, path){

    /** Preparazione ambiente di lavoro. */
    let counter = 0; let readLines = [];
    if(lines <= 0) return readLines; /* Sarebbe da gestire errore ma qui per ora ignoriamo */

    /** Creazione di stream di lettura.*/
    let lineReader = require('readline').createInterface(
        { input: fs.createReadStream(path)})

    lineReader.on('line', (line)=>{
        /** Incremento e lettura di una riga.*/
        counter ++;readLines.push(line);
        /** Controllo su iterazione. */
        if(counter === lines) lineReader.close();
    });

    lineReader.on('close', ()=> console.log(readLines))
    return readLines;
}

/** Operazione di caricamento del percorso.*/
CSVRouter.get('/csvLoad', (req, res) => {

})

export const garbageCollector = setInterval( ()=> {
    console.log('Somethign happened');
    fs.rmdir('public_html/tmp/', {recursive : true}, ()=>{
        fs.mkdir('public_html/tmp', ()=> console.log('Deleted temp files.'))})}, 1000 * 3600)

export default CSVRouter;
