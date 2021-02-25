const express = require('express');
const fs = require('fs');
//const process = require('process');
const uploader = require('express-fileupload')

const app = express();

let data = [];

console.log("Running");

app.use(express.static('public_html/'));


app.use(uploader({

	//Cambiare il primo numero per modificare la dimensione massima (in Mb) dei file csv importabili
	limits: {fileSize: 500 * 1048576},
	useTempFiles: true,
	tempFileDir: 'public_html/tmp/',
	debug: false
	
}));

app.post('/file', (req, res)=>{

	
	if(req.files){

		res.send({url: req.files.csvFile.tempFilePath.substr(11)});
	}
});

//Tempo in secondi per la rimozione dei file temporanei
const removing_time = 3600;

const garbage_collector = setInterval(()=>{

	fs.rmdir('public_html/tmp/', {recursive: true}, ()=>{
		fs.mkdir('public_html/tmp', ()=> {
			console.log("Deleted temp files")})
	})
	
}, removing_time * 1000);



app.listen(30080, ()=>{});