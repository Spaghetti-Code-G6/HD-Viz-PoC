import express from "express"
/** https://github.com/expressjs/session#readme */
import session from 'express-session'
/** https://www.npmjs.com/package/memorystore
 *  memory store is a performing manner of archiving session. Better than using a DB.*/
import memoryStore from 'memorystore'
import fs from "fs"

let sessionRouter = express.Router()

/**  Function to use whenever session gets eliminated. There's the need to check whether if session type is csv,
 *  to remove the temp file
 *  @param {String} value: session.
 *  @param {String} key: session id. */
function deleteTemp(key, value) {

    const allValues = JSON.parse(value);
    if(allValues.hdConfig === 'csv')
        fs.unlink(allValues.hdFilePath, err => console.log(err ? err : 'Bip..  bup.  deleted : ' + allValues.hdFilePath));

}
/** backup function to delete temp files if server crashes. */
(()=>{
    fs.readdir('server/csv/tmp/', (err, files) =>{
        if(err) throw  err;
        files.forEach(file => fs.unlink('server/csv/tmp/'.concat(file), err => {if(err) throw err; }))
    })
})();

/** @description storage where to store sessions */
let sessionStore = new (memoryStore(session))({
    checkPeriod: 86400000, // Prune expired entries every 24h.
    noDisposeOnSet : true,  dispose: deleteTemp  /* dispose is executed whenever a session gets deleted*/});

sessionRouter.use(session({

    cookie: { maxAge: 1800000 },
    store: sessionStore,    /*where to store sessions */

    secret: 'Spaghetti',
    saveUninitialized: true,
    resave: false

}));

/** gets session data.*/
sessionRouter.use('/session', (req, res) => res.send({sess : req.session}));

/** @description Sets the session from data.
 *  @param session: session to be set.
 *  @param {String} type: csv or db.
 *  @param {[]} metadata: Metadata.
 *  @param {String} src: if session==csv then src contains the path to the tmp file.*/
export function setSession(session, type, metadata, src = null){
    session.regenerate((err) => {if(err) console.log(err)})
    session.hdConfig = type; session.metadata = metadata;
    if(session.hdConfig === 'csv') session.hdFilePath = src;
}

/** @deprecated: logging purpose.**/
let checkSessions = setInterval(()=> sessionStore.all((err,session)=> {
    if(err) console.log(err);
    console.log("HERES STARTS THIS TICK" , session)

}), 3000)

export default sessionRouter;
