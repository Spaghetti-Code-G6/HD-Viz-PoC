import express from "express"
/** https://github.com/expressjs/session#readme */
import session from 'express-session'
/** https://www.npmjs.com/package/memorystore
 *  Il memory store è un modo di archiviazione delle sessioni su memoria molto performante.
 *  Meglio usare questo vista la nostra applicazione invece di un database.*/
import memoryStore from 'memorystore'
import fs from "fs"

let sessionRouter = express.Router()

/** Funzione di dispose per quando avviene evento di eliminazione di sessione. In particolare andiamo a controllare
 *  se la sessione interessata è di tipo csv per poter eliminare il file temporaneo.
 *
 *  @param {String} value: Passa la sessione come stringa.
 *  @param {String} key: Passa la chiave id della sessione. */
function deleteTemp(key, value) {

    const allValues = JSON.parse(value);
    /** Posso rimuovere il file temporaneo.*/
    if(allValues.hdConfig === 'csv')
        fs.unlink(allValues.hdFilePath, err => console.log(err ? err : 'Bip..  bup.  deleted : ' + allValues.hdFilePath));

}
/** Funzione anonima per la rimozioni di eventuali file temporanei che sono rimasti indietro precedentemente.
 *  Questa condizione si avvera quando il server va in crash e non ha la possibilità di eliminare i temp. */
(()=>{
    fs.readdir('server/csv/tmp/', (err, files) =>{
        if(err) throw  err;
        files.forEach(file => fs.unlink('server/csv/tmp/'.concat(file), err => {if(err) throw err; }))
    })
})(); // Chiamata a funzione.

/** @description Storage nella quale vengono salvate le sessioni attualmente valide. */
let sessionStore = new (memoryStore(session))({
    checkPeriod: 86400000, // Prune expired entries every 24h ( eliminazione da memoria).
    noDisposeOnSet : true,  dispose: deleteTemp  /* Dispose è operazione che avviene sempre quando si elimina.*/});

/** I dati su req.session sono salati a lato server (sicuro) nel nostro sessionStore (credo).*/
sessionRouter.use(session({

    cookie: { maxAge: 1800000 }, /* Età massima del cookie prima di perdere validità. */
    store: sessionStore,    /* Magazzino delle sessioni. */

    secret: 'Spaghetti',
    saveUninitialized: true,
    resave: false

}));

/** Ottieni i dati della sessione.*/
sessionRouter.use('/session', (req, res) => res.send({sess : req.session}));

/** @description Settaggio della sessione corrente da dati di caricamento.
 *  @param session: Elemento di rappresentazione della sessione da impostare.
 *  @param {String} type: Stringa di tipo di configurazione (csv, db).
 *  @param {[]} metadata: Meta dati dei dati caricati.
 *  @param {String} src: Indirizzo fisico del file temporaneo in caso di uso di type === 'csv'.*/
export function setSession(session, type, metadata, src = null){
    // Pare funzionare.
    session.regenerate((err) => {if(err) console.log(err)})

    session.hdConfig = type; session.metadata = metadata;
    if(session.hdConfig === 'csv') session.hdFilePath = src;
}

/** @deprecated: A scopo di monitoraggio.**/
let checkSessions = setInterval(()=> sessionStore.all((err,session)=> {
    if(err) console.log(err);
    console.log("HERES STARTS THIS TICK" , session)

}), 3000)

export default sessionRouter;