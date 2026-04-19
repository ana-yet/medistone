import { z } from "zod";
import { UserStatus } from "@prisma/client";

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.BANNED]),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
