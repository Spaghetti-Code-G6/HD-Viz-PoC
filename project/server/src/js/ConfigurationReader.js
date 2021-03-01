/** Lettura delle diverse configurazioni database che si possono effettuare e le relative query.*/

import fs from 'fs'

/** Folder Structure: ( Ogni configurazione è dotato di due file)
 *  dbConfig/ connection_name.sql
 *  dbConfig/ connection_name.config  **/

/** Crea la lista di file .json di configurazione che sono presenti nella directory di configurazione dei database.
 *  @param {String} path : String : Percorso delle configurazioni del server.
 *  @return {Array<string>} : Lista dei file del folder.**/
function createLists(path){
    const configList = [];
    fs.readdirSync(path).forEach((file)=> {
        /* JSON config file list. (query name, database description) */
        if (file.includes('.json')) configList.push(file)
        /* Rimuoviamo tutti i file che non siano sql.*/
        else if (!file.includes('.sql')) fs.unlinkSync(path + file)})
    return configList;
}

function makeConfigs() {

    let config = []; const path = './server/src/dbConfig/';
    createLists(path).forEach( (value => {

        let configData = JSON.parse(fs.readFileSync(path + value, 'utf-8'));
        let sqlData = fs.readFileSync(path + value.substr(0, value.length - 5) + '.sql', 'utf-8');

        /** Ignoriamo l elemento. */
        if(sqlData.length === 0) console.log('Empty')
        else {configData.query = sqlData; config.push(configData)}
    }))

    return config;
}
/** Oggetto di configurazione.*/
let config = makeConfigs();

/** Funzione per ottenere i dati sicuri da mandare al front end. Nome e descrizione del db e indice della lista di
 *  configurazioni in modo da poter poi accedere rapidamente alla scelta dell utente.
 *  @return {Array<Object>} : Lista dei dati sicuri e indice degli elementi. */
config.secureSend = () => {
    let returnObject = [];
    config.forEach( (val, index) => returnObject.push({name : val.name, description : val.description, index : index}));
    return returnObject;
}

export default config