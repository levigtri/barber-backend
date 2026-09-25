import { z } from 'zod';

export const customerIdParamSchema = z.object({
  id: z.string().uuid({ message: 'O ID do cliente deve ser um UUID válido' }),
}).strict();

export const listCustomersQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
}).strict();
