import { AUTHENTICATION } from '../constants/app_defaults.js';
import { HttpStatusCodes } from '../constants/statusCode.js';
import { verifyAccessToken } from '../helper/authentication.js';
import { responseBuilder } from '../helper/response.js';
import logger from '../logger/index.js';

const TAG = 'middleware.authentication';

export function isAuthenticated(req, res, next) {
    if (!AUTHENTICATION.enabled) {
        return next();
    }

    logger.info(`${TAG}.isAuthenticated()`);
    const token = extractToken(req);

    if (!token) {
        return sendUnauthorizedResponse(res, 'Token Required.');
    }

    try {
        const decodedToken = verifyAccessToken(token);
        req.userSession = decodedToken 
        logger.debug('LOGGED IN USER:', req.userSession);
        next();
    } catch (error) {
        logger.error('ERROR occurred in isAuthenticated() ', error);
        sendErrorResponse(error, res);
    }
}

function isAdmin(req, res, next) {
    if (!AUTHENTICATION.enabled) {
        return next();
    }

    logger.info(`${TAG}.isAdmin()`);
    const token = extractToken(req);

    if (!token) {
        return sendUnauthorizedResponse(res, 'Token Required.');
    }

    try {
        const decodedToken = verifyAccessToken(token);

        if (decodedToken?.role === 'admin') { // Replace with your desired value
            req.userSession = decodedToken ? createUserSession(decodedToken) : null;
            logger.debug('LOGGED IN USER:', req.userSession);
            next();
        } else {
            sendUnauthorizedResponse(res, 'User is not authorized to perform this action.');
        }
    } catch (error) {
        logger.error('ERROR occurred in isAdmin() ', error);
        sendErrorResponse(error, res);
    }
}

function extractToken(req) {
    let token = null;

    if (req.headers.authorization != null && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query?.token != null) {
        token = req.query.token;
    }

    return token;
}

function createUserSession(decodedToken) {
    return {
        userId: decodedToken.userId,
        userUID: decodedToken.userUID,
        email: decodedToken.email,
        phone: decodedToken.phone,
        role: decodedToken.role,
        otpType: decodedToken.otpType,
        isEmailVerified: decodedToken.isEmailVerified,
        isPhoneVerified: decodedToken.isPhoneVerified
    };
}

function sendUnauthorizedResponse(res, message) {
    const response = {
        status: HttpStatusCodes.UNAUTHORIZED,
        message,
        data: null,
        errors: [
            { message: 'Token required.', code: 'UNAUTHORIZED', field: 'jwtToken' }
        ]
    };
    responseBuilder(response, res);
}

function sendErrorResponse(error, res) {
    let response = {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        isError: true,
        errors: [
            { message: 'Token required.', code: 'UNAUTHORIZED', field: 'jwtToken' }
        ]
    };

    if (error?.message === 'jwt expired') {
        response = {
            status: HttpStatusCodes.UNAUTHORIZED,
            message: 'Session Expired',
            isError: true,
            errors: [
                { message: 'Token expired.', code: 'UNAUTHORIZED', field: 'jwtToken' }
            ]
        };
    } else if (error?.message === 'invalid signature' || error?.message === 'invalid token') {
        response = {
            status: HttpStatusCodes.UNAUTHORIZED,
            message: 'Invalid Token',
            isError: true,
            errors: [
                { message: 'Invalid token.', code: 'UNAUTHORIZED', field: 'jwtToken' }
            ]
        };
    }

    responseBuilder(response, res);
}
