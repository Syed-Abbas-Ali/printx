import * as APIPaths from '../../../constants/apiPaths.js';
import {Router} from 'express';
import AuthRoutes from './auth.js';


const router = Router();

router.use(APIPaths.ROUTER_AUTH, AuthRoutes);


export default router;
