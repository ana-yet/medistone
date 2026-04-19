import { z } from "zod";

export const adminCreateUserSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["SELLER", "ADMIN"]),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
