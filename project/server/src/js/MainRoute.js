import express from 'express';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import subscriptionList from "./subscriptionList.js";

const __dirname = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));

let mainRouter = express.Router();

/** test per vedere se la sessione funziona ed è unica per utente connesso.
 *  Lo è effettivamente quindi faremo uso di essa per fare routing.
 *  Il client onload() dovrà fare la richiesta per vedere se una sessione attiva.*/
mainRouter.use('/home', (req, res) =>{

    /** Se la session è attiva allora mandiamo i meta dati.*/
    if(req.session.metadata) res.send(req.session.metadata)
    else res.sendFile(__dirname +  '/client/src/html/index.html')
})

/** Per motivi di sicurezza farei una bella POST.*/
mainRouter.use('/session', ((req, res) => {

    if(req.session.hdVizId > 0){
        if(req.session.sourceType === 'csv') {

            subscriptionList.update(req.session.hdVizId);
            res.send({ url: req.session.sourceFile, meta: req.session.metadata })

        } else { console.log('sql bip bup bup...') }
    } else { res.send({ invalid: true }); }

}))

export default mainRouter;