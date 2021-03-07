import express from 'express';

import sessionRouter from './src/js/components/sessionManager.js';
import csvRoute from "./src/js/routes/csvRoute.js";

/** File di configurazione di accesso al database e dati relativi.*/
import config from './src/js/components/configurationReader.js'
import dbRoute from './src/js/routes/dbRoute.js';

import updateRoute from './src/js/routes/updateRoute.js'

let hdViz = express()
const PORT = 8085; /** Porta alla quale il server fa ascolto.*/

/** Percorsi accessibili staticamente.*/
hdViz.use('/', express.static('public_html'))
hdViz.use('/server/csv/tmp', express.static('server/csv/tmp'))


hdViz.use(sessionRouter);
hdViz.use('/csv', csvRoute);

hdViz.use(dbRoute);

hdViz.use('/update', updateRoute);

/** @deprecated*/
hdViz.get('/db/list', ((req, res) => res.send(config.secureSend())))


//TODO: Spostare da qualche altra parte.
/** Manda (post o get) Un oggetto contenente i dati della sessione. Esso è vuoto nel momento in cui non è ancora stato
 *  effettuato un caricamento da una fonte dati o se la sessione precedente è scaduta, altrimenti contiene i meta dati, la cfg e le eventuali proprietà del grafico.*/
hdViz.use('/prevSession', ((req, res) => {
    /** Deep copy of object. Così non mandiamo dati sul cookie e le cose che il front end non deve avere.*/
    let sessionApp = JSON.parse(JSON.stringify(req.session));
    delete sessionApp.cookie; /* Elimino parte di cookie.*/
    res.send(sessionApp);

}))


hdViz.listen(PORT); /* Siamo in ascolto di richieste HTTP. */
export default hdViz;


// Dati : Categorico Ordinale Intervallo Ratio (ha 0)