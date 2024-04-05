import * as authController from "../../controller/authController.js"
import { Router } from 'express';
import { isAuthenticated } from "../../middleware/isAuthenticate.js";
const router = Router();

router.route('/signup').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/change-password').post(isAuthenticated,authController.changePassword);
router.route('/otp').post(isAuthenticated,authController.otpVerify);
router.route('/otp-resend').post(isAuthenticated,authController.otpResend);
router.route('/forget-password').post(authController.forgotPassword);

export default router