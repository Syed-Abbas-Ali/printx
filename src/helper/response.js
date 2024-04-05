import pkg from 'lodash';
const { isArray, isEmpty, isObject, transform } = pkg;
import logger from '../logger/index.js';

function cleanResponseData(responseData) {
    try {
        function nestedDataClean(nestedObject) {
            return transform(nestedObject, (result, value, key) => {
                const isCollection = isObject(value);
                const cleaned = isCollection ? nestedDataClean(value) : value;

                if (isCollection && isEmpty(cleaned)) {
                    return;
                } else if (typeof value === 'undefined' || value === null) {
                    return;
                }

                isArray(result) ? result.push(cleaned) : (result[key] = cleaned);
            });
        }

        return isObject(responseData) ? nestedDataClean(responseData) : responseData;
    } catch (error) {
        logger.error('ERROR occurred in helpers.dto.');
        throw error;
    }
}

function responseBuilder(serviceResponse, res, next, req) {
    logger.info('helper.response_builder.responseBuilder(');
    try {
        res.set('message', serviceResponse.message);

        if (serviceResponse.errors && serviceResponse.errors.length !== 0) {
            res.status(serviceResponse.statusCode ?? 400).send({ errors: serviceResponse.errors });
        } else {
            res.status(serviceResponse.statusCode ?? (req.method === 'POST' ? 201 : 200)).send(serviceResponse);
        }

    } catch (error) {
        logger.error('ERROR occurred in helper.response_builder.responseBuilder()', error);
        next(error);
    }
}

export { cleanResponseData, responseBuilder };
