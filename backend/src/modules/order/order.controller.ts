import type { Request, Response } from "express";
import { orderService } from "./order.service";
import { AppError } from "../../utils/errors";
import { created, ok } from "../../utils/response";
import type {
  AddCartItemInput,
  CheckoutInput,
  PatchCartItemInput,
  UpdateOrderStatusInput,
} from "./order.validation";

function customerId(req: Request): string {
  const id = req.user?.id;
  if (!id) {
    throw AppError.unauthorized();
  }
  return id;
}

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const cart = await orderService.getCart(customerId(req));
  res.status(200).json(ok(cart));
};

export const postCartItem = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as AddCartItemInput;
  await orderService.addCartItem(customerId(req), body);
  const cart = await orderService.getCart(customerId(req));
  res.status(200).json(ok(cart));
};

export const patchCartItem = async (req: Request, res: Response): Promise<void> => {
  const { medicineId } = req.params as { medicineId: string };
  const body = req.body as PatchCartItemInput;
  await orderService.patchCartItem(customerId(req), medicineId, body);
  const cart = await orderService.getCart(customerId(req));
  res.status(200).json(ok(cart));
};

export const deleteCartItem = async (req: Request, res: Response): Promise<void> => {
  const { medicineId } = req.params as { medicineId: string };
  await orderService.removeCartItem(customerId(req), medicineId);
  res.status(204).send();
};

export const checkout = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CheckoutInput;
  const order = await orderService.checkout(customerId(req), body);
  res.status(201).json(created(order));
};

export const listMyOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await orderService.listForCustomer(customerId(req));
  res.status(200).json(ok(orders));
};

export const getMyOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params as { orderId: string };
  const order = await orderService.getForCustomer(customerId(req), orderId);
  res.status(200).json(ok(order));
};

export const listSellerOrders = async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user?.id;
  if (!sellerId) {
    throw AppError.unauthorized();
  }
  const orders = await orderService.listForSeller(sellerId);
  res.status(200).json(ok(orders));
};

export const patchSellerOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const sellerId = req.user?.id;
  if (!sellerId) {
    throw AppError.unauthorized();
  }
  const { orderId } = req.params as { orderId: string };
  const body = req.body as UpdateOrderStatusInput;
  const order = await orderService.updateStatusForSeller(sellerId, orderId, body);
  res.status(200).json(ok(order));
};

export const patchAdminOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params as { orderId: string };
  const body = req.body as UpdateOrderStatusInput;
  const order = await orderService.updateStatusAdmin(orderId, body);
  res.status(200).json(ok(order));
};

export const listAllOrdersAdmin = async (_req: Request, res: Response): Promise<void> => {
  const orders = await orderService.listAllAdmin();
  res.status(200).json(ok(orders));
};
