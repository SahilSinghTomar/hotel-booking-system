import * as z from "zod";

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.optional(z.string()),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => {
    if (data.currentPassword && !data.newPassword) {
      return false;
    }

    return true;
  }, "New password is required when changing password");

export const AccountSettingsSchema = z.object({
  email: z.optional(z.string().email()),
  isTwoFactorEnabled: z.optional(z.boolean()),
});

export const BasicProfileSettingsSchema = z.object({
  name: z.optional(z.string()),
});

export const ResetPasswordFormSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  code: z.optional(z.string()),
});

export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
