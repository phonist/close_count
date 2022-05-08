import { Appwrite } from 'appwrite';
import { Server } from '../../utils/config';

let timerApi = {
    sdk: null,

    provider: () => {
        if (timerApi.sdk) {
          return timerApi.sdk;
        }
        let appwrite = new Appwrite();
        appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
        timerApi.sdk = appwrite;
        return appwrite;
    },

    createDocument: (collectionId, data, read, write) => {
        return timerApi
        .provider()
        .database.createDocument(Server.collectionID, 'unique()', data, read, write);
    },

    listDocuments: (collectionId) => {
        return timerApi.provider().database.listDocuments(Server.collectionID);
    },

    updateDocument: (collectionId, documentId, data, read, write) => {
        return timerApi
        .provider()
        .database.updateDocument(collectionId, documentId, data, read, write);
    },

    deleteDocument: (collectionId, documentId) => {
        return timerApi.provider().database.deleteDocument(collectionId, documentId);
    },
}

export default timerApi;