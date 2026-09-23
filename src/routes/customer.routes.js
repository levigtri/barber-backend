import { Router } from 'express';
import { customerController } from '../controllers/customer.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', customerController.list);
router.get('/:id', customerController.getById);

export const customerRoutes = router;
