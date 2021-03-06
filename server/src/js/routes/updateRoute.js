/**manage session update so that data is preserved*/
import express from 'express'

let updateRoute = express.Router()

updateRoute.post('/graph', (req,res) =>{
    /** saving user preferences in session.*/
    req.session.graphConfiguration = req.body.graphConfiguration;
    res.send({saved: 'okay'});
})
