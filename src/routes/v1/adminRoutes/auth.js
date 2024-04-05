import * as adminAuth from "../../../controller/admin/adminAuth.js"
import { Router } from 'express';
const router = Router();

router.route('/signup').post(adminAuth.createAdmin);

export default router