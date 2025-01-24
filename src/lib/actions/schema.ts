import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  companyName: z.string().min(3, "Company name must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const resetPasswordSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const onBoardingSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  logo: z
    .custom<File>((value) => value instanceof File, "File is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png formats are supported"
    )
    .optional(),
  teamMembers: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
      })
    )
    .optional(),
});
