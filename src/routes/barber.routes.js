import { Router } from 'express';
import { barberController } from '../controllers/barber.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import {
  barberIdParamSchema,
  listBarbersQuerySchema,
  createBarberBodySchema,
  updateBarberBodySchema,
} from '../schemas/barber.schema.js';

const router = Router();

router.get(
  '/',
  validateRequest({ query: listBarbersQuerySchema }),
  barberController.list
);

router.get(
  '/:id',
  validateRequest({ params: barberIdParamSchema }),
  barberController.getById
);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validateRequest({ body: createBarberBodySchema }),
  barberController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validateRequest({
    params: barberIdParamSchema,
    body: updateBarberBodySchema,
  }),
  barberController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validateRequest({ params: barberIdParamSchema }),
  barberController.remove
);

export const barberRoutes = router;
