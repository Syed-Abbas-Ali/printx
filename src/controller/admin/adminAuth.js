import { responseBuilder } from '../../helper/response.js';
import log from '../../logger/index.js';
import * as authService from '../../services/admin/adminAuthSrvices.js';

const TAG = 'controller.adminAuth';

async function createAdmin(req, res, next) {
    try {
        log.info(TAG + `.createAdmin()`);
        log.debug(`signup object = ${JSON.stringify(req.body)}`);
        const user =req.body;
        const authResposne = await authService.createAdmin(user);
        responseBuilder(authResposne, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.createAdmin()`, error);
        next(error);
    }
}

export { createAdmin };
