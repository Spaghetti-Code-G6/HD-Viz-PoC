import express from 'express'
let dbRouter = express.Router();

/* Sequelize */
import config from '../components/configurationReader.js'
import bodyParser from 'body-parser';

import {setSession} from '../components/sessionManager.js'

import pkg from 'sequelize';
const {QueryTypes, Sequelize} = pkg;

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

dbRouter.use(jsonParser);
dbRouter.use(urlencodedParser);

dbRouter.post('/selected', async (req,res) =>{

    /** Select the correct configuration.*/
    let data = config[req.body.selectedConfig];

    let connection = new Sequelize(data.database, data.username, data.password,
        {dialect: data.dialect, host: data.host,  port: data.port});

    const results = await connection.query(data.query, {type: QueryTypes.SELECT});

    await connection.close();

    setSession(req.session, 'db', makeMetadata(results));
    res.send({data: results, meta: req.session.metadata});
})

/** @param jsonDataset {Array<JSON>} dataset.
 *  @function could make it asyc with consumer/producer
 *  @return {Array<JSON>} metadata. */
export function makeMetadata(jsonDataset){

    const metadata = {};
    Object.keys(jsonDataset[0]).forEach(entry => metadata[entry] = {
            visibility: true,
            type: !isNaN(+jsonDataset[0][entry]) ? typeof +jsonDataset[0][entry] : typeof jsonDataset[0][entry]})

    return metadata;
}

export default dbRouter;
