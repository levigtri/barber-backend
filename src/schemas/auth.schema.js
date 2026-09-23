import { z } from 'zod';

export const customerAuthBodySchema = z.object({
  name: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
  phone: z
    .string({ message: 'O telefone é obrigatório' })
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{10,11}$/, { message: 'O telefone deve ter 10 ou 11 dígitos (DDD + número)' })),
}).strict();

export const adminAuthBodySchema = z.object({
  password: z.string({ message: 'A senha é obrigatória' }).min(1, { message: 'A senha é obrigatória' }),
}).strict();
