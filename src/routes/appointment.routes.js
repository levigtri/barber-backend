import { Router } from 'express';
import { appointmentReadController } from '../controllers/appointment.read.controller.js';
import { appointmentWriteController } from '../controllers/appointment.write.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  appointmentIdParamSchema,
  listAppointmentsQuerySchema,
  availableSlotsQuerySchema,
} from '../schemas/appointment.read.schema.js';

const router = Router();

router.get(
  '/available-slots',
  validateRequest({ query: availableSlotsQuerySchema }),
  appointmentReadController.availableSlots
);
router.get(
  '/',
  authenticate,
  validateRequest({ query: listAppointmentsQuerySchema }),
  appointmentReadController.list
);
router.post('/', authenticate, authorize('CUSTOMER'), appointmentWriteController.create);
router.get(
  '/:id',
  authenticate,
  validateRequest({ params: appointmentIdParamSchema }),
  appointmentReadController.getById
);
router.patch('/:id/status', authenticate, appointmentWriteController.updateStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), appointmentWriteController.remove);

export const appointmentRoutes = router;
