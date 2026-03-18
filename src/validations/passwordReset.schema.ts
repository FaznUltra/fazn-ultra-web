import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const verifyResetOTPSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits')
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetOTPFormData = z.infer<typeof verifyResetOTPSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
