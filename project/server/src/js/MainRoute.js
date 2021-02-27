import Router from 'express';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));

let mainRouter = Router();

/** test per vedere se la sessione funziona ed è unica per utente connesso.
 *  Lo è effettivamente quindi faremo uso di essa per fare routing.
 *  Il client onload() dovrà fare la richiesta per vedere se una sessione attiva.*/
mainRouter.use('/home', (req, res) =>{
    /** Se la session è attiva allora mandiamo i meta dati.*/
    if(req.session.metadata) res.send(req.session.metadata)
    else res.sendFile(__dirname +  '/client/src/html/index.html')

})

export default mainRouter;