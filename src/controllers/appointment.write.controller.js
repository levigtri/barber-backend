import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { isValidSlot } from '../config/slots.js';
import { HttpError } from '../utils/httpError.js';
import { appointmentInclude, serializeAppointment } from '../utils/serializers.js';

const validTransitions = {
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};

export const appointmentWriteController = {
  async create(req, res, next) {
    try {
      const { barberServiceId, barberId, scheduledAt } = req.body;
      const scheduledDate = new Date(scheduledAt);

      if (scheduledDate <= new Date()) {
        return res.status(400).json({ message: 'Não é possível agendar em uma data passada' });
      }

      if (!isValidSlot(scheduledDate)) {
        return res.status(400).json({ message: 'Horário fora da lista de horários disponíveis' });
      }

      const appointment = await prisma.$transaction(
        async (transaction) => {
          const service = await transaction.barberService.findUnique({
            where: { id: barberServiceId },
          });

          if (!service || !service.isActive) {
            throw new HttpError(400, 'Serviço inexistente ou inativo');
          }

          const barber = await transaction.barber.findUnique({
            where: { id: barberId },
          });

          if (!barber || !barber.isActive) {
            throw new HttpError(400, 'Barbeiro inexistente ou inativo');
          }

          const conflict = await transaction.appointment.findFirst({
            where: {
              barberId,
              scheduledAt: scheduledDate,
              status: { not: 'CANCELED' },
            },
          });

          if (conflict) {
            throw new HttpError(409, 'Este horário já está ocupado para este barbeiro');
          }

          return transaction.appointment.create({
            data: {
              customerId: req.user.id,
              barberId,
              barberServiceId,
              scheduledAt: scheduledDate,
              price: service.price,
            },
            include: appointmentInclude,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      return res.status(201).json(serializeAppointment(appointment));
    } catch (error) {
      if (error?.code === 'P2034') {
        return res.status(409).json({ message: 'Este horário acabou de ser reservado. Escolha outro horário.' });
      }
      return next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await prisma.appointment.findUnique({ where: { id } });

      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }

      if (req.user.role === 'CUSTOMER') {
        if (appointment.customerId !== req.user.id) {
          return res.status(404).json({ message: 'Agendamento não encontrado' });
        }
        if (status !== 'CANCELED') {
          return res.status(403).json({ message: 'Clientes só podem cancelar agendamentos' });
        }
      }

      if (!validTransitions[appointment.status].includes(status)) {
        return res.status(400).json({
          message: `Não é possível mudar o status de ${appointment.status} para ${status}`,
        });
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: { status },
        include: appointmentInclude,
      });

      return res.json(serializeAppointment(updatedAppointment));
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const appointment = await prisma.appointment.findUnique({ where: { id } });

      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }

      await prisma.appointment.delete({ where: { id } });

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
