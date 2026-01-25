const requireEnv = (value: string | undefined, name: string): string => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

export const Server = {
    endpoint: requireEnv(process.env.REACT_APP_ENDPOINT, 'REACT_APP_ENDPOINT'),
    project: requireEnv(process.env.REACT_APP_PROJECT, 'REACT_APP_PROJECT'),
    collectionID: requireEnv(process.env.REACT_APP_COLLECTION_ID, 'REACT_APP_COLLECTION_ID'),
};
