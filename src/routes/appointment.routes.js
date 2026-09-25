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
import {
  createAppointmentBodySchema,
  updateAppointmentStatusBodySchema,
} from '../schemas/appointment.write.schema.js';

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
router.post('/', authenticate, authorize('CUSTOMER'), validateRequest({ body: createAppointmentBodySchema }), appointmentWriteController.create);
router.get(
  '/:id',
  authenticate,
  validateRequest({ params: appointmentIdParamSchema }),
  appointmentReadController.getById
);
router.patch('/:id/status', authenticate, validateRequest({ params: appointmentIdParamSchema, body: updateAppointmentStatusBodySchema }), appointmentWriteController.updateStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), validateRequest({ params: appointmentIdParamSchema }), appointmentWriteController.remove);

export const appointmentRoutes = router;
