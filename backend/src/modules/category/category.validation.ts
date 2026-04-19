import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(120),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(120),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryIdParamSchema = z.object({
  id: z.string().uuid(),
});
