/**reading different db configurations and associated query*/
import fs from 'fs'

/** Folder Structure:
 *  dbConfig/ connection_name.sql
 *  dbConfig/ connection_name.config  **/

/** Creates all the .json files needed for the configuration
 *  @param {String} path : String : server configuration path.
 *  @return {Array<string>} : file list.**/
function createLists(path){
    const configList = [];
    fs.readdirSync(path).forEach((file)=> {
        /* JSON config file list. (query name, database description) */
        if (file.includes('.json')) configList.push(file)
        /* removes all sql files.*/
        else if (!file.includes('.sql')) fs.unlinkSync(path + file)})
    return configList;
}

function makeConfigs() {

    let config = []; const path = './server/src/dbConfig/';
    createLists(path).forEach( (value => {

        let configData = JSON.parse(fs.readFileSync(path + value, 'utf-8'));
        let sqlData = fs.readFileSync(path + value.substr(0, value.length - 5) + '.sql', 'utf-8');

        /** ignore item. */
        if(sqlData.length === 0) console.log('Empty')
        else {configData.query = sqlData; config.push(configData)}
    }))

    return config;
}
/** configuration object.*/
const config = makeConfigs();

/** Function for getting safe data to send to the front end.
 *  @return {Array<Object>} : list of safe data and indexes. */
config.secureSend = () => {
    let returnObject = [];

    config.forEach( (val, index) =>
        returnObject.push({name : val.name, description : val.description, index : index}));

    return returnObject;

}

export default config
