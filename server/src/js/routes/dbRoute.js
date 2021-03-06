import express from 'express'
import bodyParser from 'body-parser';

import {setSession} from '../components/sessionManager.js'

import pkg from 'sequelize';
import config from '../components/configurationReader.js'

let dbRouter = express.Router();

const {QueryTypes, Sequelize} = pkg;

const availableOptions = config.secureSend();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false})

dbRouter.use(jsonParser);
dbRouter.use(urlencodedParser);

/** Richiesta per ottenimento delle configurazione possibili.*/
dbRouter.post('/available', (req, res) =>
    res.send({options: availableOptions}))

/** Risposta alla selezione di una fonte tra quelle rese disponibili.*/
dbRouter.post('/selected', async (req, res) => {
    console.log(req.body)
    /** Select the correct configuration.*/
    let data = config[req.body.selectedConfig];

    let connection = new Sequelize(data.database, data.username, data.password,
        {dialect: data.dialect, host: data.host, port: data.port});

    const results = await connection.query(data.query, {type: QueryTypes.SELECT});
    // TODO: Trovare un modo per fare la query ai tipi di dati.

    await connection.close();

    setSession(req.session, 'db', makeMetadata(results), null, req.body.selectedConfig);
    res.send({data: results, meta: req.session.metadata});
})

/** @param jsonDataset {Array<JSON>} Dati di cui è stata eseguita la query.
 *  @function Si potrebbe rendere async facendo consumatori / produttori.
 *  @return {Array<JSON>} meta dati costruiti. */
export function makeMetadata(jsonDataset) {

    const metadata = {};
    Object.keys(jsonDataset[0]).forEach(entry => metadata[entry] = {
        visibility: true,
        type: !isNaN(+jsonDataset[0][entry]) ? typeof +jsonDataset[0][entry] : typeof jsonDataset[0][entry]
    })

    return metadata;
}

export default dbRouter;