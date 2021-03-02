import express from 'express';


import sessionRouter from './src/js/components/sessionManager.js';
import csvRoute from "./src/js/routes/csvRoute.js";

/** File di configurazione di accesso al database e dati relativi.*/
import config from './src/js/components/configurationReader.js'



let hdViz = express()
const PORT = 8085; /** Porta alla quale il server fa ascolto.*/

/** Percorsi accessibili staticamente.*/
hdViz.use('/public', express.static( 'client'))
hdViz.use('/server/csv/tmp', express.static('server/csv/tmp'))


hdViz.use(sessionRouter);
hdViz.use('/csv', csvRoute);

/** @deprecated*/
hdViz.get('/db/list', ((req, res) => res.send(config.secureSend())))

hdViz.listen(PORT); /* Siamo in ascolto di richieste HTTP. */
export default  hdViz;

