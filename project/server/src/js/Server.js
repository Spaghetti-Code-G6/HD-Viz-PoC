
import express from 'express';
/* Routing per file di CSV*/
import CSVRouter from "./CSVRoute.js";
import {garbageCollector} from './CSVRoute.js'

const port = 8085;

let app = express()
app.use('/csv', CSVRouter)

import fs from 'fs'
import Router from "express";

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

app.get('/db/list', ((req, res) => {

    let conf = []
    configList.forEach((elem) => {

        let rawData = fs.readFileSync('sqlConfigurations/' + elem, 'utf-8')
        conf.push(JSON.parse(rawData))

    })

    res.body = conf
    res.send(conf)

}))

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

app.get('/graph',((req, res, next) => {

}))

app.listen(port)

console.log(garbageCollector)

