import { z } from "zod";

export const createReviewSchema = z.object({
  medicineId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const medicineReviewsParamSchema = z.object({
  id: z.string().uuid(),
});
