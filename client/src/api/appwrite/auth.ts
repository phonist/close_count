import { Appwrite } from 'appwrite';
import { Server } from '../../utils/config';

let authApi = {
    sdk: null,

    provider: () => {
        if (authApi.sdk) {
          return authApi.sdk;
        }
        let appwrite = new Appwrite();
        appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
        authApi.sdk = appwrite;
        return appwrite;
    },

    register: ( params ) => {
        let { email, password, name } = params;
        return authApi.provider().account.create('unique()', email, password, name);
    },

    createSession: (email, password) => {
        return authApi.provider().account.createSession(email, password);
    },

    createJWT: () => {
        return authApi.provider().account.createJWT();
    },

    loadUser: ( params ) => {
        return authApi.provider().account.get();
    },
    
    getAccount: () => {
        return authApi.provider().account.get();
    },
    
    deleteCurrentSession: () => {
        return authApi.provider().account.deleteSession('current');
    },
}

export default authApi;