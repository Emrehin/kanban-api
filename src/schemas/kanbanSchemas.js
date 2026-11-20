import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Kullanıcı adı zorunludur.' })
    .trim()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır.')
    .max(30, 'Kullanıcı adı en fazla 30 karakter olabilir.'),
  email: z
    .string({ required_error: 'E-posta zorunludur.' })
    .trim()
    .email('Geçerli bir e-posta adresi giriniz.'),
  password: z
    .string({ required_error: 'Şifre zorunludur.' })
    .min(6, 'Şifre en az 6 karakter olmalıdır.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(1, 'Şifre zorunludur.'),
});

export const createBoardSchema = z.object({
  title: z
    .string({ required_error: 'Pano başlığı zorunludur.' })
    .trim()
    .min(3, 'Pano başlığı en az 3 karakter olmalıdır.')
    .max(100, 'Pano başlığı en fazla 100 karakter olabilir.'),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Görev başlığı zorunludur.' })
    .trim()
    .min(2, 'Görev başlığı en az 2 karakter olmalıdır.')
    .max(150, 'Görev başlığı en fazla 150 karakter olabilir.'),
  description: z.string().trim().max(500).optional().nullable(),
  board_id: z
    .number({ required_error: 'board_id sayısal bir değer olmalıdır.' })
    .int()
    .positive(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    errorMap: () => ({
      message: 'Durum yalnızca TODO, IN_PROGRESS veya DONE olabilir.',
    }),
  }),
});