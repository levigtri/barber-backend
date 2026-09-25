import { prisma } from '../config/prisma.js';
import { SLOTS, getDayRange, toLocalParts, toScheduledAt } from '../config/slots.js';
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

  async availableSlots(req, res, next) {
    try {
      const { date, barberId, barberServiceId } = req.query;

      const barber = await prisma.barber.findUnique({
        where: { id: barberId },
        select: { id: true, isActive: true },
      });

      if (!barber || !barber.isActive) {
        return res.status(400).json({ message: 'Barbeiro inexistente ou inativo' });
      }

      const service = await prisma.barberService.findUnique({
        where: { id: barberServiceId },
        select: { id: true, isActive: true },
      });

      if (!service || !service.isActive) {
        return res.status(400).json({ message: 'Serviço inexistente ou inativo' });
      }

      const { start, end } = getDayRange(date);

      const taken = await prisma.appointment.findMany({
        where: {
          barberId,
          scheduledAt: { gte: start, lt: end },
          status: { not: 'CANCELED' },
        },
        select: { scheduledAt: true },
      });

      const takenTimes = new Set(taken.map((a) => toLocalParts(a.scheduledAt).time));

      const now = new Date();
      const availableSlots = SLOTS.filter(
        (slot) => !takenTimes.has(slot) && toScheduledAt(date, slot) > now,
      );

      return res.json({ date, availableSlots });
    } catch (error) {
      return next(error);
    }
  },
};
