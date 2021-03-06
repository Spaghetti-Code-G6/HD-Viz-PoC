import express from 'express'
/** Middle-ware for file upload.*/
import uploader from 'express-fileupload'

import fs from 'fs'
import readLine from 'readline'

let csvRouter = express.Router()

/** session manager.*/
import {setSession}  from '../components/sessionManager.js'

/** setting limits.*/
csvRouter.use(uploader({

    limits : { fileSize: 500 * 1048576 }, /** file dimension limit.*/

    useTempFiles : true,
    tempFileDir: 'server/csv/tmp/'

}));

/**loads csv and gathers data, setting session so that connection loss are managed.*/
csvRouter.post('/file', async (req, res) =>{

    if(req.files) { /* file upload successfully*/
        if (checkCsv(req.files.csvFile.name)) {

            const firstLines = await read(2, req.files.csvFile.tempFilePath);
            if(firstLines.length > 1) {

                firstLines[0] = firstLines[0].split(',');
                firstLines[1] = firstLines[1].split(',');

                let metaData = {};
                for (let i = 0; i < firstLines[0].length; i++) {

                    metaData[firstLines[0][i]] = {
                        visibility: true,
                        type: !isNaN(+firstLines[1][i]) ? typeof +firstLines[1][i] : typeof firstLines[1][i],
                    }

                }
                /** correct setting of current session.*/
                setSession(req.session, 'csv', metaData, req.files.csvFile.tempFilePath);
                console.log(req.files.csvFile.tempFilePath)
                res.send({url: await req.files.csvFile.tempFilePath, meta: metaData})
            } else{ res.send({err: 'Errore nella dimensione del file'}); }
        } else res.send({err: 'Errore in formato file.'})
    }
})

function checkCsv(fileName) { return fileName.substr(fileName.length - 4) === '.csv'; }


/** @param  limit : number rows to be extracted.
 *  @param  path : String file path.
 *  @return {Promise<Array>} : read and saved rows.*/
function read(limit, path){

    const readStream = readLine.createInterface({ input: fs.createReadStream(path)})
    return new Promise(((resolve, reject) => {

        let readLines = []; let counter = 0;

        readStream.on("line", chunk => {
            counter ++; readLines.push(chunk);

            if(counter === limit)  readStream.close(); });

        readStream.on("close", () => resolve(readLines)); /** returns promised value*/
        readStream.on("error", error => reject(error));
    }));
}

export default csvRouter;
