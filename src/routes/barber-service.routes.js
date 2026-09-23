import { Router } from 'express';
import { barberServiceController } from '../controllers/barber-service.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', barberServiceController.list);
router.get('/:id', barberServiceController.getById);
router.post('/', authenticate, authorize('ADMIN'), barberServiceController.create);
router.put('/:id', authenticate, authorize('ADMIN'), barberServiceController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), barberServiceController.remove);

export const barberServiceRoutes = router;
