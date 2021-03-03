import express from 'express'
let dbRouter = express.Router();


/* Sequelize */
import config from '../components/configurationReader.js'
import {Sequelize} from 'sequelize'


/** Semplice test.*/
dbRouter.post('/selected', async (req,res) =>{

    /** Select the correct configuration.*/
    let data = config[res.body.selectedElement];

    let sequelize = new Sequelize(data.database, data.username, data.password, {host: data.host, port: data.port});

    const results = await sequelize.query(data.query);
    await sequelize.close();

    res.send({data: results});

})