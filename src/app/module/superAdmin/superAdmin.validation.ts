import { z } from "zod";

export const createSuperAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateSuperAdminSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  profilePicture: z.string().optional(),
});

export type CreateSuperAdminInput = z.infer<typeof createSuperAdminSchema>;
export type UpdateSuperAdminInput = z.infer<typeof updateSuperAdminSchema>;
