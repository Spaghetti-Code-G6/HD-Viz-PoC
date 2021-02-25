
import express from 'express';
/* Routing per file di CSV*/
import CSVRouter from "./src/js/CSVRoute.js";
import {garbageCollector} from './src/js/CSVRoute.js'

import {config} from './src/js/ConfigurationReader.js'

const port = 8085;

let app = express()
app.use('/csv', CSVRouter)

app.use('/', express.static( 'client'))
app.use('/server/csv/tmp', express.static('server/csv/tmp'))

import fs from 'fs'


app.use(express.static('public'));

/**
 *  sqlConfigurations/
 *      connection_name.sql
 *      connection_name.config
 *
 *      connection_name.sql
 *      connection_name.config
 *
 *      connection_name.sql
 *      connection_name.config
 * */

/** @deprecated*/
app.get('/db/list', ((req, res) => {

    let conf = []
    configList.forEach((elem) => {

        let rawData = fs.readFileSync('sqlConfigurations/' + elem, 'utf-8')
        conf.push(JSON.parse(rawData))

    })

    res.body = conf
    res.send(conf)

}))
/** @deprecated*/
app.post('/dbAccess', (req, res) => {
    /** Accesso al db dato.*/
    console.log(req.body.password)
    if( req && req.body.inputAddress != null && req.body.dbName != null && req.body.dbPsw && req.body.dbUserName != null){

        console.log("Credentials sent.")

    } else {
        res.body.error = true;
        console.log("Errore di connessione")
    }
})
/** @deprecated*/
app.get('/graph',((req, res, next) => {
    console.log(config)
    res.send(config)
}))

app.listen(port)


