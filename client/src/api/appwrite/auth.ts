import { Appwrite } from 'appwrite';
import { Server } from '../../utils/config';

type AppwriteSdk = Appwrite;

const authApi = {
    sdk: null as AppwriteSdk | null,

    provider: (): AppwriteSdk => {
        if (authApi.sdk) {
          return authApi.sdk;
        }
        const appwrite = new Appwrite();
        appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
        authApi.sdk = appwrite;
        return appwrite;
    },

    register: (params: { email: string; password: string; name: string }) => {
        const { email, password, name } = params;
        return authApi.provider().account.create('unique()', email, password, name);
    },

    createSession: (email: string, password: string) => {
        return authApi.provider().account.createSession(email, password);
    },

    createJWT: () => {
        return authApi.provider().account.createJWT();
    },

    loadUser: () => {
        return authApi.provider().account.get();
    },
    
    getAccount: () => {
        return authApi.provider().account.get();
    },
    
    deleteCurrentSession: () => {
        return authApi.provider().account.deleteSession('current');
    },
};

export default authApi;
