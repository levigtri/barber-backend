import { z } from 'zod';

export const barberServiceIdParamSchema = z
  .object({
    id: z.string().uuid({ message: 'O ID do serviço deve ser um UUID válido' }),
  })
  .strict();

export const listBarberServicesQuerySchema = z
  .object({
    activeOnly: z
      .enum(['true', 'false'], {
        message: "O parâmetro activeOnly deve ser 'true' ou 'false'",
      })
      .optional()
      .transform((value) => (value === undefined ? true : value === 'true')),
  })
  .strict();

const barberServiceFields = {
  name: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
  description: z.string().optional().nullable(),
  price: z.number({ message: 'O preço deve ser um número' }).positive({ message: 'O preço deve ser maior que zero' }),
  durationMinutes: z.number({ message: 'A duração deve ser um número' }).int({ message: 'A duração deve ser um número inteiro' }).positive({ message: 'A duração deve ser maior que zero' }),
  icon: z.string().optional().nullable(),
  isActive: z.boolean({ message: 'O campo isActive deve ser booleano' }),
};

export const createBarberServiceBodySchema = z
  .object({
    ...barberServiceFields,
    isActive: barberServiceFields.isActive.optional().default(true),
  })
  .strict();

export const updateBarberServiceBodySchema = z
  .object({
    name: barberServiceFields.name.optional(),
    description: barberServiceFields.description,
    price: barberServiceFields.price,
    durationMinutes: barberServiceFields.durationMinutes,
    icon: barberServiceFields.icon,
    isActive: barberServiceFields.isActive,
  })
  .strict();