import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { barberRoutes } from './barber.routes.js';
import { barberServiceRoutes } from './barber-service.routes.js';
import { customerRoutes } from './customer.routes.js';
import { appointmentRoutes } from './appointment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/barbers', barberRoutes);
router.use('/barber-services', barberServiceRoutes);
router.use('/customers', customerRoutes);
router.use('/appointments', appointmentRoutes);

export const routes = router;
