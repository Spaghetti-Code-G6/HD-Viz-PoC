
const configList = [];
const sqlList = [];

(function createLists(){
    /** Accesso ai file solo locale in quanto non mi serve più avanti*/

    import fs from 'fs'

    fs.readdir('sqlConfigurations/', ((err, files) => {
        if(!err) {
            files.forEach(file => {
                /* Query to target database.*/
                if(file.includes('.sql')) sqlList.push(file)
                /* JSON config file. (query name, database description) */
                else if(file.includes('json')) configList.push(file)
                /* Remove the file as its not in the right folder.*/
                else fs.unlinkSync('sqlConfigurations/' + file)
            })
        }
    }));
})() /* Call to function to create the files names. (During runtime it won't be possible to
        update the sources? */

function updateLists(){

}

export {configList, sqlList, updateLists}