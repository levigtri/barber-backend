import { z } from 'zod';

export const createAppointmentBodySchema = z
  .object({
    barberServiceId: z.string().uuid({ message: 'barberServiceId deve ser um UUID válido' }),
    barberId: z.string().uuid({ message: 'barberId deve ser um UUID válido' }),
    scheduledAt: z.iso.datetime({ offset: true, message: 'scheduledAt deve ser uma data ISO 8601 com fuso horário' }),
  })
  .strict();

export const updateAppointmentStatusBodySchema = z
  .object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'], {
      message: 'Status inválido',
    }),
  })
  .strict();