import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';

export const authController = {
  async customer(req, res, next) {
    try {
      const { name, phone } = req.body;

      let customer = await prisma.customer.findUnique({
        where: { phone },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: { name, phone },
        });
      }

      const token = signToken({ id: customer.id, role: 'CUSTOMER' });

      return res.json({ customer, token });
    } catch (error) {
      return next(error);
    }
  },

  async admin(req, res, next) {
    try {
      const { password } = req.body;

      const admins = await prisma.admin.findMany();

      for (const admin of admins) {
        if (await bcrypt.compare(password, admin.password)) {
          const token = signToken({ id: admin.id, role: 'ADMIN' });

          return res.json({
            admin: {
              id: admin.id,
              createdAt: admin.createdAt,
              updatedAt: admin.updatedAt,
            },
            token,
          });
        }
      }

      return res.status(401).json({ message: 'Senha inválida' });
    } catch (error) {
      return next(error);
    }
  },
};
