import * as APIPaths from '../../constants/apiPaths.js';
import {Router} from 'express';
// import AuthRoutes from './adminRoutes/index.js';
import AuthRoutes from './authRoutes.js';

const router = Router();

// router.use(APIPaths.ROUTER_ADMIN, AuthRoutes);
router.use(APIPaths.ROUTER_AUTH, AuthRoutes);


export default router;
