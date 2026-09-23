import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { barberRoutes } from './barber.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/barbers', barberRoutes);

export const routes = router;
