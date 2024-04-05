import bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import {AES_ENC_KEY, AES_IV} from '../config/index.js';

export async function hashPassword(plainPassword){
    return bcrypt.hash(plainPassword, 5);
}

export async function comparePasswords(hashedPassword, plainPassword){
    return bcrypt.compare(plainPassword, hashedPassword)
}

export async function decryptString(encrypted) {
    return CryptoJS.AES.decrypt(encrypted, AES_ENC_KEY, {}).toString(CryptoJS.enc.Utf8);
}