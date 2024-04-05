import logger from '../logger/index.js';
import { hashPassword,comparePasswords } from '../helper/encryption.js';
import * as Auth from '../db/db_comands/authentication.js';
import{HttpStatusCodes} from "../constants/statusCode.js"
import { generateAccessToken,generateJWT } from '../helper/authentication.js';
import { sendSMS } from '../constants/sendSMS.js';
import  otpGenerator from "otp-generator"


const TAG = 'auth.service';

export async function createUser(user) {
  logger.info(`${TAG}.createUser() ==> `, user);

  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    user.password = await hashPassword(user.password);

    const existedUser = await Auth.checkEmailOrPhoneExist(user.email);
    if (existedUser!=null) {
      serviceResponse.message = 'Email or Phone already exists';
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      return serviceResponse;
    } else {
      let otp=otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false });
      const tokken=await generateJWT({...user,otp,new:true},200,process.env.JWT_ACCESS_TOKEN_SECRET)
      const RefreshTokken=await generateJWT({...user,new:true},3600,process.env.JWT_ACCESS_TOKEN_SECRET)
      await sendSMS({otp,email:user.email})
      logger.debug('saved user::' +user);
      serviceResponse.data = {
        message: 'please check your email and veryfy.',
        tokken,
        email:user.email,
        RefreshTokken
      };
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.createUser`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}

export async function otpVerify(user) {
  logger.info(`${TAG}.otpVerify() ==> `, user);

  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    if (!user) {
      serviceResponse.message = 'tokken expired';
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      return serviceResponse;
    } else {
      if(user && user.oldData && user.otp){
        if(user.oldData.otp==user.otp){
          console.log(user)
          if(user.oldData.new==true){
            let res=await Auth.createUser({...user.oldData})
          logger.debug('saved user::' +user);
          serviceResponse.data = {
            message: 'registered successfully !.',
            ...res
          };
          }else{
            const tokken=await generateJWT({id:user.oldData.id,email:user.oldData.email},6000,process.env.JWT_ACCESS_TOKEN_SECRET)
            logger.debug('saved user::' +user);
            serviceResponse.data = {
              message: 'please set new password.',
              tokken
            };
          }
        }else{
          console.log(user)
          logger.debug('saved user::' +user);
          serviceResponse.data = {
            message: 'invalid otp !.',
          };
        }
      }
     
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.createUser`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}

export async function otpResend(user) {
  logger.info(`${TAG}.otpResend() ==> `, user);

  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    if (!user) {
      serviceResponse.message = 'tokken expired';
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      return serviceResponse;
    } else {
      if(user){
        // console.log(user)
        let otp=otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false });
        const tokken=await generateJWT({fullname:user.fullname,password:user.password,new:user.new,email:user.email,otp},200,process.env.JWT_ACCESS_TOKEN_SECRET)
        const RefreshTokken=await generateJWT({fullname:user.fullname,password:user.password,new:user.new,email:user.email},3600,process.env.JWT_ACCESS_TOKEN_SECRET)
        await sendSMS({otp,email:user.email})
        serviceResponse.message = 'resended succesfully !';
        serviceResponse.data={
          tokken,
          RefreshTokken,
          email:user.email
        }
        return serviceResponse;
      }
     
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.otpResend`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}

export async function loginUser(user) {
  logger.info(`${TAG}.loginUser() ==> `, user);
  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    const existedUser = await Auth.checkEmailOrPhoneExist(user.email);
    console.log(existedUser)
    if (existedUser) {
      const isPasswordCorrect=await comparePasswords(existedUser.password,user.password)
      if(isPasswordCorrect){
        const tokken=await generateAccessToken({id:existedUser._id,email:existedUser.email})
        serviceResponse.statusCode = HttpStatusCodes.OK;
        serviceResponse.data={
          tokken
        }
      }else{
        serviceResponse.message = 'wrong password !';
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      }
    } else {
      serviceResponse.message = 'invalid email !';
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST; 
      serviceResponse.data = null
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.loginUser`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}


export async function changePassword(user) {
  logger.info(`${TAG}.changePassword() ==> `, user);

  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    const existedUser = await Auth.checkEmailOrPhoneExist(user.email);
    if (existedUser) {
      user.password = await hashPassword(user.password);
      const res = await Auth.findAndUpdate({...user});
      serviceResponse.message = 'password changed !';
      serviceResponse.statusCode = HttpStatusCodes.OK;
      serviceResponse.data = res;
      return serviceResponse;
    } else {
      serviceResponse.message = 'invalid !';
      serviceResponse.statusCode = HttpStatusCodes.NOT_FOUND;
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.changePassword`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}

export async function forgotPassword(user) {
  logger.info(`${TAG}.forgotPassword() ==> `, user);

  const serviceResponse = {statusCode:HttpStatusCodes.CREATED};
  try {
    // user.password = await hashPassword(user.password);

    const existedUser = await Auth.checkEmailOrPhoneExist(user.email);
    if (!existedUser) {
      serviceResponse.message = 'invalid email !';
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      return serviceResponse;
    } else {
      let otp=otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false });
      // let response=await Auth.createUser({...user}
      // const tokken=await generateAccessToken()

      const tokken=await generateJWT({id:existedUser._id,email:existedUser.email,otp,new:false},300,process.env.JWT_ACCESS_TOKEN_SECRET)
      const RefreshTokken=await generateJWT({...user,new:false},3600,process.env.JWT_ACCESS_TOKEN_SECRET)

      await sendSMS({otp,email:user.email})
      logger.debug('saved user::' +user);
      serviceResponse.data = {
        message: 'please check your Email for otp.',
        tokken,
        RefreshTokken
      };
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.forgotPassword`, error);
    serviceResponse.error='Failed to create admin due to technical difficulties';
  }
  return serviceResponse;
}