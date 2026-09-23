import { Router } from 'express';
import { customerController } from '../controllers/customer.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { customerIdParamSchema, listCustomersQuerySchema } from '../schemas/customer.schema.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', validateRequest({ query: listCustomersQuerySchema }), customerController.list);
router.get('/:id', validateRequest({ params: customerIdParamSchema }), customerController.getById);

export const customerRoutes = router;
