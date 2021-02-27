import Express from 'express';
import session from 'express-session'

import CSVRouter from "./src/js/CSVRoute.js";
import mainRouter  from "./src/js/MainRoute.js"

import config from './src/js/ConfigurationReader.js'

const port = 8085;

let hdViz = Express()

/** Sessione utente.*/
hdViz.use(session({secret: 'Spaghetti'}))

/** Routing di file statici accessibili:*/
hdViz.use('/', Express.static( 'client'))
hdViz.use('/server/csv/tmp', Express.static('server/csv/tmp'))

/** Routing personalizzati:*/
hdViz.use('/csv', CSVRouter)
hdViz.use(mainRouter) /* Percorso di base.*/


/** @deprecated*/
hdViz.get('/db/list', ((req, res) => res.send(config.secureSend())))

hdViz.listen(port); /* Siamo in ascolto di richieste HTTP. */
export default  hdViz;

