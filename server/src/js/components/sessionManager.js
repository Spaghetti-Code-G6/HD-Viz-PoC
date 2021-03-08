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
    if (allValues.hdConfig === 'csv')
        fs.unlink(allValues.hdFilePath, err => console.log(err ? err : 'Bip..  bup.  deleted : ' + allValues.hdFilePath));

}

/** Funzione anonima per la rimozioni di eventuali file temporanei che sono rimasti indietro precedentemente.
 *  Questa condizione si avvera quando il server va in crash e non ha la possibilità di eliminare i temp. */
(() => {
    fs.readdir('server/csv/tmp/', (err, files) => {
        if (err) throw  err;
        files.forEach(file => fs.unlink('server/csv/tmp/'.concat(file), err => {
            if (err) throw err;
        }))
    })
})(); // Chiamata a funzione.

/** @description Storage nella quale vengono salvate le sessioni attualmente valide. */
let sessionStore = new (memoryStore(session))({
    checkPeriod: 86400000, // Prune expired entries every 24h ( eliminazione da memoria).
    noDisposeOnSet: true, dispose: deleteTemp  /* Dispose è operazione che avviene sempre quando si elimina.*/
});

/** I dati su req.session sono salati a lato server (sicuro) nel nostro sessionStore (credo).*/
sessionRouter.use(session({

    cookie: {maxAge: 1800000}, /* Età massima del cookie prima di perdere validità. */
    store: sessionStore,    /* Magazzino delle sessioni. */
    unset: 'destroy',
    secret: 'Spaghetti',
    saveUninitialized: true,
    resave: false

}));

/** Ottieni i dati della sessione.*/
sessionRouter.use('/session', (req, res) => res.send({sess: req.session}));

/** @description Setup of the current user session with its data.
 *  @param req: Request passed that has a session property.
 *  @param {String} type: Source of the data (csv, db).
 *  @param {[]} metadata: Metadata to store in the session (to not calculate again).
 *  @param index {?Number} : Index of the database selectable elements, if db selected.
 *  @param {String} src:  Path of temporary file, if csv as src selected.*/
export function setSession(req, type, metadata, src = null, index = null) {
    //TODO: Remove promise and use callback.
    return new Promise(((resolve, reject) => {
        req.session.regenerate((err) =>{
            /** Everything in the callback happens after the regenerate function takes place.*/
            if(err) reject(err);

            req.session.hdConfig = type;
            req.session.metadata = metadata

            if (type === 'csv')  req.session.hdFilePath = src;
            else if (type  === 'db') req.session.hdDbSelection = index;
            resolve(true);
        })
    }))
}

/** @deprecated: A scopo di monitoraggio.**/
let checkSessions = setInterval(() => sessionStore.all((err, session) => {
    if (err) console.log(err);
    console.log("HERES STARTS THIS TICK", session)

}), 9000000)

export default sessionRouter;