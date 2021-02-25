
import fs from 'fs'

function createLists(){

    const configList = []; const sqlList = [];
    fs.readdirSync('./server/src/dbConfig').forEach((file)=> {
        /* Query to target database.*/
        if (file.includes('.sql')) sqlList.push(file)
        /* JSON config file. (query name, database description) */
        else if (file.includes('.json')) configList.push(file)
        /* Remove the file as its not in the right folder.*/
        else fs.unlinkSync('./server/src/dbConfig/' + file)})
    return {cfg: configList, sql : sqlList}
}

function updateLists(){

}

/** TODO: Ripensare, si può fare meglio (ad esempio solo leggere file json e avere in quello linkato il file sql.
 *   in più leggere il file json.*/
function makeConfigs() {

    let data = createLists()
    const configList = data.cfg; const sqlList = data.sql;

    if(configList.length !== sqlList.length){/** Trovare quelli soli e scartarli.*/ return ['abba']}

    let config = []

    configList.forEach( (configValue) =>{

        let configStr = configValue.substr(0,configValue.length - 5);
        sqlList.forEach((sqlValue, index, obj)=> {

            let sqlStr = sqlValue.substr(0, sqlValue.length - 4);
            if(configStr === sqlStr) {
                /** Aggiunta alla configurazione.*/
                config.push({config: configStr, query: sqlStr});

                /** Rimozione elemento da lista file sql.*/
                obj.splice(index,1);
            }
        })
    })

    return config;
}

let config = makeConfigs();
export { config, updateLists}