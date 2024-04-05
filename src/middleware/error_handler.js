import { ErrorCodes, ErrorMessages } from '../constants/error_constants.js';
import { HttpStatusCodes } from '../constants/statusCode.js';
import { responseBuilder } from '../helper/response.js';
import logger from '../logger/index.js';

export function errorHandler(error, req, res, next) {
    logger.info('errorHandler()');
    try {
        const response =[
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.INTERNAL_SERVER_ERROR,
            null]

                if (error) {
            if (error.httpCode) response.statusCode = error.httpCode;
            if (error.message) response.message = error.message;
            response.errors = error.errors;
        } else {
            logger.error('handling ERROR :', error);
        }

        return responseBuilder(response, res, next, req);
    } catch (e) {
        logger.error('Error in middlewares.errorHandler()', e);
    }

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        errors: [(ErrorMessages.INTERNAL_SERVER_ERROR, ErrorCodes.SYSTEM_ERROR, null)]
    });
}
