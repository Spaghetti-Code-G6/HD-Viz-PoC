/** La modifica dei meta dati avviene a lato client. Tuttavia per la natura della sessione
 *  è anche necessario che il server aggiorni i suoi ( indifferentemente dalla fonte dei dati ) */

import express from 'express';
import subscriptionList from "./subscriptionList.js";

let editRouter = express.Router();

editRouter.get('/updateMeta',(req,res, next)=>{

    /** Aggiorno per csv? Il secondo è un controllo inutile*/
    if(req.session.source === 'csv' && req.session.hdVizId > 0)
        subscriptionList.update(req.session.hdVizId)

    /* Update dei meta dati su sessione. */
    req.session.metadata = req.body.metadata; next()
})

export default editRouter;