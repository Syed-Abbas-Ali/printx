export const PORT = process.env.PORT || 8001;
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "uuuu";
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'printx_jwt_a';
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'printx_jwt_r';
export const JWT_ACCESS_TOKEN_EXPIRY_TIME = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME || '') || (2 * 60 * 60);
export const JWT_REFRESH_TOKEN_EXPIRY_TIME = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME || '') || (30 * 24 * 60 * 60);


// server.js in loader folder
export const CORS_ORIGIN_URLS = process.env.CORS_ORIGIN || '*';
export const API_CALL_LOG_FORMAT = process.env.API_CALL_LOG_FORMAT ||
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';
export const REQUEST_BODY_LIMIT = parseInt(process.env.REQUEST_BODY_LIMIT || '100');

export const AES_ENC_KEY = process.env.ASE_ENC_KEY || 'bf3c199c2470cb477d907b1e0917c17b';
export const AES_IV = process.env.ASE_IV || '5183666c72eec9e4';



export async function checkEnv() {
    logger.info('STARTED Validation of env variables!');
    const mandatoryFields = ['SQL_DATABASE_HOST', 'SQL_DATABASE_USERNAME', 'SQL_DATABASE_PASSWORD'];
    mandatoryFields.forEach((field) => {
        if (!process.env[field]) {
            throw new AppError(`Required configuration '${field}' is missing`);
        }
    });
}