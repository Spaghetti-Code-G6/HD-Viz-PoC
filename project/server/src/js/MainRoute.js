import Router from 'express';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url)))));

let mainRouter = Router();

const __root = '';

/** test per vedere se la sessione funziona */
mainRouter.use('/', (req, res) =>{

    if(req.session.metadata) res.send(req.session.metadata)
    else res.sendFile(__dirname +  '/client/src/html/index.html')
    console.log(__dirname)

})

export default mainRouter;