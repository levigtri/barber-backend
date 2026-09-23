import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { customerAuthBodySchema, adminAuthBodySchema } from '../schemas/auth.schema.js';

const router = Router();

router.post(
  '/customer',
  validateRequest({ body: customerAuthBodySchema }),
  authController.customer
);

router.post(
  '/admin',
  validateRequest({ body: adminAuthBodySchema }),
  authController.admin
);

export const authRoutes = router;
