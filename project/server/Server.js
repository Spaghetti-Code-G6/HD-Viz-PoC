
import Express from 'express';

import CSVRouter from "./src/js/CSVRoute.js";
import config from './src/js/ConfigurationReader.js'

const port = 8085;
let hdViz = Express()

/** Routing personalizzati:*/
hdViz.use('/csv', CSVRouter)

/** Routing di file statici accessibili:*/
hdViz.use('/', Express.static( 'client'))
hdViz.use('/server/csv/tmp', Express.static('server/csv/tmp'))

/** @deprecated*/
hdViz.get('/db/list', ((req, res) => res.send(config.secureSend())))

hdViz.listen(port) /* Siamo in ascolto di richieste HTTP. */
export default  hdViz

