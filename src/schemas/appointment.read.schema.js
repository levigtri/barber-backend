import { z } from 'zod';

export const appointmentIdParamSchema = z
  .object({
    id: z.string().uuid({ message: 'O ID do agendamento deve ser um UUID válido' }),
  })
  .strict();

export const listAppointmentsQuerySchema = z
  .object({
    status: z
      .enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'], {
        message: 'Status inválido',
      })
      .optional(),
    customerId: z.string().uuid({ message: 'customerId deve ser um UUID válido' }).optional(),
    barberId: z.string().uuid({ message: 'barberId deve ser um UUID válido' }).optional(),
    date: z.iso.date({ message: 'date deve estar no formato AAAA-MM-DD' }).optional(),
  })
  .strict();

export const availableSlotsQuerySchema = z
  .object({
    date: z.iso.date({ message: 'date deve estar no formato AAAA-MM-DD' }),
    barberId: z.string().uuid({ message: 'barberId deve ser um UUID válido' }),
    barberServiceId: z.string().uuid({ message: 'barberServiceId deve ser um UUID válido' }),
  })
  .strict();
