import { prisma } from '../config/prisma.js';
import { getDayRange } from '../config/slots.js';
import { appointmentInclude, serializeAppointment } from '../utils/serializers.js';

export const appointmentReadController = {
  async list(req, res, next) {
    try {
      const { status, customerId, barberId, date } = req.query;
      const where = {};

      if (status) where.status = status;
      if (barberId) where.barberId = barberId;
      if (req.user.role === 'CUSTOMER') {
        where.customerId = req.user.id;
      } else if (customerId) {
        where.customerId = customerId;
      }

      if (date) {
        const { start, end } = getDayRange(date);
        where.scheduledAt = { gte: start, lt: end };
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: appointmentInclude,
        orderBy: { scheduledAt: 'asc' },
      });

      return res.json(appointments.map(serializeAppointment));
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: appointmentInclude,
      });

      if (!appointment || (req.user.role === 'CUSTOMER' && appointment.customerId !== req.user.id)) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }

      return res.json(serializeAppointment(appointment));
    } catch (error) {
      return next(error);
    }
  },

  async availableSlots(req, res) {
    return res.status(501).json({ message: 'Não implementado' });
  },
};
