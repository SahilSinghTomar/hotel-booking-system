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

// HOTEL SCHEMAS
export const CreateHotelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  description: z.string().min(1, "Description is required"),
  website: z.optional(z.string()),
});

export const UpdateHotelSchema = z.object({
  name: z.optional(z.string().min(1, "Name is required")),
  address: z.optional(z.string().min(1, "Address is required")),
  country: z.optional(z.string().min(1, "Country is required")),
  city: z.optional(z.string().min(1, "City is required")),
  state: z.optional(z.string().min(1, "State is required")),
  zip: z.optional(z.string().min(1, "Zip is required")),
  phone: z.optional(z.string().min(1, "Phone is required")),
  website: z.optional(z.string().min(1, "Website is required")),
  description: z.optional(z.string().min(1, "Description is required")),
});

// ROOM SCHEMAS
export const CreateRoomTypeSchema = z.object({
  name: z.string().min(1, "Romm type name is required"),
  amenities: z.record(z.string(), z.string()).optional(),
  rates: z
    .array(
      z.object({
        rate: z.number(),
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }),
      })
    )
    .optional(),
  inventory: z
    .array(
      z.object({
        totalRooms: z.number(),
        availableRooms: z.number(),
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }),
      })
    )
    .optional(),
});

export const UpdateRoomTypeSchema = CreateRoomTypeSchema.partial();
