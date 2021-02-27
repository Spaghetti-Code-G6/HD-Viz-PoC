/** Oggetto per la rappresentazione di sottoscrizione alla piattaforma HDViz nel momento in cui si ha un caricamento
 *  dei dati. Possibile aggiornare la propria posizione per guadagnare priorità sulla conservazione.
 *  Perché ? Per evitare di cancellare dal server i file csv temporanei di persone che potrebbero richiederne l'uso.*/
let subscriptionList = [];
subscriptionList.indexFeeder = 0;

/** Aggiunta di una subscription.
 *  @return {Number} : Intero indice del nuovo elemento creato.*/
subscriptionList.add = (fileName)=> {

    subscriptionList.indexFeeder++;
    return subscriptionList.push({ id: subscriptionList.indexFeeder, fileName: fileName, time: Date.now() });

}

subscriptionList.update = (id) => {
    /** Indice dell elemento se trovato*/
    const index = subscriptionList.findIndex( (item) => item.id === id);
    if(index > -1){

        const data = subscriptionList[index];
        subscriptionList.splice(index, 1);

        /** Creazione del nuovo elemento.*/
        return subscriptionList.add(data.fileName);

    } else { console.log('Element not found.'); return -1; }
}

/** @return {Array<Object>} : Lista di sessioni eliminate.*/
subscriptionList.purge = num => { return subscriptionList.splice(0, num);}

export default subscriptionList;