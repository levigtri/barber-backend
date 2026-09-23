import { prisma } from '../config/prisma.js';

function buildSearchWhere(search) {
  if (!search) return {};

  const digits = search.replace(/\D/g, '');
  const conditions = [{ name: { contains: search, mode: 'insensitive' } }];

  if (digits) {
    conditions.push({ phone: { contains: digits } });
  }

  return { OR: conditions };
}

export const customerController = {
  async list(req, res, next) {
    try {
      const { search } = req.query;

      const customers = await prisma.customer.findMany({
        where: buildSearchWhere(search),
        orderBy: { name: 'asc' },
      });

      return res.json(customers);
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res) {
    return res.status(501).json({ message: 'Não implementado' });
  },
};
