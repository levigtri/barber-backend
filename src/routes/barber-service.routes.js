import { Router } from 'express';
import { barberServiceController } from '../controllers/barber-service.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
	barberServiceIdParamSchema,
	createBarberServiceBodySchema,
	listBarberServicesQuerySchema,
	updateBarberServiceBodySchema,
} from '../schemas/barber-service.schema.js';

const router = Router();

router.get('/', validateRequest({ query: listBarberServicesQuerySchema }), barberServiceController.list);
router.get('/:id', validateRequest({ params: barberServiceIdParamSchema }), barberServiceController.getById);
router.post('/', authenticate, authorize('ADMIN'), validateRequest({ body: createBarberServiceBodySchema }), barberServiceController.create);
router.put('/:id', authenticate, authorize('ADMIN'), validateRequest({ params: barberServiceIdParamSchema, body: updateBarberServiceBodySchema }), barberServiceController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), validateRequest({ params: barberServiceIdParamSchema }), barberServiceController.remove);

export const barberServiceRoutes = router;
