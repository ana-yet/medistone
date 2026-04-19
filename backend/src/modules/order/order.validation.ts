import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const addCartItemSchema = z.object({
  medicineId: z.string().uuid(),
  quantity: z.number().int().min(1).max(999),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;

export const patchCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(999),
});

export type PatchCartItemInput = z.infer<typeof patchCartItemSchema>;

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(5).max(500),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartMedicineParamSchema = z.object({
  medicineId: z.string().uuid(),
});

export const orderIdParamSchema = z.object({
  orderId: z.string().uuid(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    OrderStatus.PLACED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
