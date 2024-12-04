import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }).nonempty('Phone number is required'),
  isDeleted: z.boolean().optional(),
  //
});
