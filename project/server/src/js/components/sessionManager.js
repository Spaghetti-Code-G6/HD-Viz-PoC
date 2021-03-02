import express from "express";
/** https://github.com/expressjs/session#readme */
import session from 'express-session'
/**  Il memory store è un modo di archiviazione delle sessioni su memoria molto performante.
 *  Meglio usare questo vista la nostra applicazione invece di un database.*/
import memoryStore from 'memorystore'

let sessionRouter = express.Router()

export const deleteBuffer = [];

/** Funzione di dispose per quando avviene evento di eliminazione di sessione. In particolare andiamo a controllare
 *  se la sessione interessata è di tipo csv per poter eliminare il file temporaneo.*/
function deleteTemp(key, value) {

    /** Posso rimuovere il file temporaneo.*/
    if(value.hdConfig === 'csv')
        deleteBuffer.push(value.hdFilePath);
}


/* Gestione delle sessioni. */
let sessionStore = new (memoryStore(session))({ dispose: deleteTemp /* Options here*/ });


/** I dati su req.session sono salati a lato server (sicuro) nel nostro sessionStore (credo).*/
sessionRouter.use(session({

    cookie: { maxAge: 120000 }, /* Età massima del cookie prima di perdere validità. */
    store: sessionStore,    /* Magazzino delle sessioni. */
    secret: 'Spaghetti',
    saveUninitialized: true

}));

/** Ottieni i dati della sessione.*/
sessionRouter.use('/session', (req, res) => {
    res.send({sess : req.session})
});



export function setSession(session, type, metadata, src = null){

    session.hdConfig = type; session.metadata = metadata;
    /** Controllo sul tipo di sessione, data da csv ha anche un file temporaneo.*/
    if(session.hdConfig === 'csv') session.hdFilePath = src;

    return session;
}

/** @deprecated: A scopo di monitoraggio.**/
let checkSessions = setInterval(()=> sessionStore.all((err,session)=> console.log(session)), 3000)


export default sessionRouter;