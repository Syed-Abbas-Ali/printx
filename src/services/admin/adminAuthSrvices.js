import logger from '../../logger/index.js';
import { hashPassword } from '../../helper/encryption.js';
import * as adminAuth from '../../db/db_comands/admin/auth_connection.js';
import{HttpStatusCodes} from "../../constants/statusCode.js"

const TAG = 'auth.service';

export async function createAdmin(user) {
  logger.info(`${TAG}.createAdmin() ==> `, user);

  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    user.password = await hashPassword(user.password);

    const existedUser = await adminAuth.checkEmailOrPhoneExist(user.email);
    if (existedUser) {
      serviceResponse.message = 'Email or Phone already exists';
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      return serviceResponse;
    } else {
        
      let response=await adminAuth.createAdmin({...user})
      logger.debug('saved user::' +user);
      serviceResponse.data = {
        message: 'Signup successful.',
        response
      };
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.createAdmin`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}

