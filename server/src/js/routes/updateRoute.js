/** Gestisce l aggiornamento della configurazione in sessione in modo da mantenere i dati.*/
import express from 'express'

let updateRoute = express.Router()

updateRoute.post('/graph', (req, res) => {
    /** Ci salviamo la configurazione dell utente sul grafico costruito in sessione (impostazioni).*/
    req.session.customSettings = req.body.graphConfiguration;
    res.send({saved: 'okay'});
})

export default updateRoute;