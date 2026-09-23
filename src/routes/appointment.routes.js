import { Router } from 'express';
import { appointmentReadController } from '../controllers/appointment.read.controller.js';
import { appointmentWriteController } from '../controllers/appointment.write.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/available-slots', appointmentReadController.availableSlots);
router.get('/', authenticate, appointmentReadController.list);
router.post('/', authenticate, authorize('CUSTOMER'), appointmentWriteController.create);
router.get('/:id', authenticate, appointmentReadController.getById);
router.patch('/:id/status', authenticate, appointmentWriteController.updateStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), appointmentWriteController.remove);

export const appointmentRoutes = router;
