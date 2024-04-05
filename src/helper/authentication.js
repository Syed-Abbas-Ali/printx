import jsonwebtoken from 'jsonwebtoken';
// import {
//     JWT_ACCESS_TOKEN_SECRET,
//     JWT_REFRESH_TOKEN_SECRET,
//     OTP_EXPIRY_TIME,
//     JWT_ACCESS_TOKEN_EXPIRY_TIME,
//     JWT_REFRESH_TOKEN_EXPIRY_TIME
// } from '../config/index.js';
import logger from '../logger/index.js';

export function generateJWT(payload, expiresIn, secret) {
    return jsonwebtoken.sign(Object.assign({}, payload), secret, {
        algorithm: 'HS256',
        expiresIn,
    });
}

export function generateAccessToken(payload, expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME) {
    try {
        return generateJWT(payload, expiresIn, process.env.JWT_ACCESS_TOKEN_SECRET);
    } catch (e) {
        logger.error(`ERROR in login generateAccessToken() => ${e}`);
    }
}

export function generateRefreshToken(payload, expiresIn = JWT_REFRESH_TOKEN_EXPIRY_TIME) {
    try {
        return generateJWT(payload, expiresIn, JWT_REFRESH_TOKEN_SECRET);
    } catch (e) {
        logger.error(`ERROR in login generateRefreshToken() => ${e}`);
    }
}

export function verifyAccessToken(token) {
    return jsonwebtoken.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
}

// export function verifyRefreshToken(token) {
//     return jsonwebtoken.verify(token, JWT_REFRESH_TOKEN_SECRET);
// }

// export async function generateOTPToken(payload, expiresIn = OTP_EXPIRY_TIME) {
//     try {
//         return generateJWT(payload, expiresIn, JWT_ACCESS_TOKEN_SECRET);
//     } catch (error) {
//         logger.error(`ERROR in login generateRefreshToken() => ${error}`);
//     }
// }

export const verifyOTPToken = async (token) => {
    return jsonwebtoken.verify(token, JWT_ACCESS_TOKEN_SECRET);
};
