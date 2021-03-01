import Express from 'express';ù
/** https://github.com/expressjs/session#readme */
import session from 'express-session'

/** https://www.npmjs.com/package/memorystore
 *  Il memory store è un modo di archiviazione delle sessioni su memoria molto performante.
 *  Meglio usare questo vista la nostra applicazione invece di un database.*/
import memoryStore from 'memorystore'

/** Routes. Upcoming structure:
 *  - Retrieve Data Route (SQL + CSV ? o li divido?)
 *  - Session Manager
 *  - Editor Middleware */

import CSVRouter from "./src/js/CSVRoute.js";
import mainRouter  from "./src/js/MainRoute.js"
import editRouter from "./src/js/EditMeta.js";

import config from './src/js/ConfigurationReader.js'

const PORT = 8085;

let hdViz = Express()

/** Sessione utente. TODO: Implement store.*/
hdViz.use(session({secret: 'Spaghetti'}))

/** Routing di file statici accessibili:*/
hdViz.use('/public', Express.static( 'client'))
hdViz.use('/server/csv/tmp', Express.static('server/csv/tmp'))

/** Routing personalizzati:*/
hdViz.use('/csv', CSVRouter)
hdViz.use('/update', editRouter)
hdViz.use(mainRouter) /* Percorso di base.*/

/** @deprecated*/
hdViz.get('/db/list', ((req, res) => res.send(config.secureSend())))

hdViz.listen(PORT); /* Siamo in ascolto di richieste HTTP. */
export default  hdViz;

