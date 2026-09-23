import { prisma } from '../config/prisma.js';

const statsInclude = {
  appointments: {
    select: { price: true, status: true, scheduledAt: true },
  },
};

function buildSearchWhere(search) {
  if (!search) return {};

  const digits = search.replace(/\D/g, '');
  const conditions = [{ name: { contains: search, mode: 'insensitive' } }];

  if (digits) {
    conditions.push({ phone: { contains: digits } });
  }

  return { OR: conditions };
}

function toCustomerWithStats({ appointments, ...customer }) {
  const active = appointments.filter((appointment) => appointment.status !== 'CANCELED');
  const completed = appointments.filter((appointment) => appointment.status === 'COMPLETED');

  const totalSpent = completed.reduce((sum, appointment) => sum + Number(appointment.price), 0);
  const lastAppointmentDate = completed.reduce(
    (latest, appointment) => (!latest || appointment.scheduledAt > latest ? appointment.scheduledAt : latest),
    null
  );

  return {
    ...customer,
    totalAppointments: active.length,
    totalSpent: Number(totalSpent.toFixed(2)),
    lastAppointmentDate,
  };
}

export const customerController = {
  async list(req, res, next) {
    try {
      const { search } = req.query;

      const customers = await prisma.customer.findMany({
        where: buildSearchWhere(search),
        include: statsInclude,
        orderBy: { name: 'asc' },
      });

      return res.json(customers.map(toCustomerWithStats));
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await prisma.customer.findUnique({
        where: { id },
        include: statsInclude,
      });

      if (!customer) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      return res.json(toCustomerWithStats(customer));
    } catch (error) {
      return next(error);
    }
  },
};
