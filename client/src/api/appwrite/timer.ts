import { Appwrite } from 'appwrite';
import { Server } from '../../utils/config';

type AppwriteSdk = Appwrite;

const getCollectionId = (collectionId?: string): string => {
    return collectionId ?? Server.collectionID;
};

const timerApi = {
    sdk: null as AppwriteSdk | null,

    provider: (): AppwriteSdk => {
        if (timerApi.sdk) {
          return timerApi.sdk;
        }
        const appwrite = new Appwrite();
        appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
        timerApi.sdk = appwrite;
        return appwrite;
    },

    createDocument: (
        collectionId: string | undefined,
        data: Record<string, unknown>,
        read?: string[],
        write?: string[]
    ) => {
        return timerApi
        .provider()
        .database.createDocument(getCollectionId(collectionId), 'unique()', data, read, write);
    },

    listDocuments: (collectionId?: string) => {
        return timerApi.provider().database.listDocuments(getCollectionId(collectionId));
    },

    updateDocument: (
        collectionId: string,
        documentId: string,
        data: Record<string, unknown>,
        read?: string[],
        write?: string[]
    ) => {
        return timerApi
        .provider()
        .database.updateDocument(collectionId, documentId, data, read, write);
    },

    deleteDocument: (collectionId: string, documentId: string) => {
        return timerApi.provider().database.deleteDocument(collectionId, documentId);
    },
};

export default timerApi;
