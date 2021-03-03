// TODO: Extend where and when needed.
/** Aggiorno i meta dati quando sono cambiati.*/
export function editMetadata(session, metadata){
    session.metadata = metadata;
    return session;
}
