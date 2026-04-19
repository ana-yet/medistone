import { z } from "zod";

export const medicineListQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type MedicineListQuery = z.infer<typeof medicineListQuerySchema>;

export const medicineIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createMedicineSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid(),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;

export const updateMedicineSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  description: z.string().max(5000).nullable().optional(),
  categoryId: z.string().uuid().optional(),
});

export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;

export const updateStockSchema = z.object({
  stock: z.number().int().min(0),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
