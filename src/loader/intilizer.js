import {mongoConnection}  from "../db/connection.js"
import log from '../logger/index.js';
import initializeRoutes from '../routes/index.js';
import serverLoader from './server.js';

export async function initializeApp(app) {
    try {
        // await checkEnv();
        await mongoConnection();
        serverLoader(app);
        initializeRoutes(app);
    } catch (error) {
        log.error('ERROR occurred in initializeApp().', error);
        throw error;
    }
}

