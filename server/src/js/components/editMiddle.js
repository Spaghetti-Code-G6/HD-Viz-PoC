// TODO: Extend where and when needed.
/** updates $metadata whenever updated.*/
export function editMetadata(session, metadata){
    session.metadata = metadata;
    return session;
}
