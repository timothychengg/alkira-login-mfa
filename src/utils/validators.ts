import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include at least 1 uppercase letter')
  .regex(/[a-z]/, 'Include at least 1 lowercase letter')
  .regex(/[0-9]/, 'Include at least 1 number');

export const otpSchema = z.string().regex(/^\d{6}$/, 'Enter the 6-digit code');
