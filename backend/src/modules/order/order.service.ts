import { OrderStatus } from "@prisma/client";
import prisma from "../../prisma/client";
import { AppError } from "../../utils/errors";
import type {
  AddCartItemInput,
  CheckoutInput,
  PatchCartItemInput,
  UpdateOrderStatusInput,
} from "./order.validation";

async function getOrCreateCartId(userId: string): Promise<string> {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) {
    return existing.id;
  }
  const created = await prisma.cart.create({ data: { userId } });
  return created.id;
}

const orderDetailInclude = {
  orderItems: {
    include: {
      medicine: {
        include: {
          category: { select: { id: true, name: true } },
          seller: { select: { id: true, name: true } },
        },
      },
    },
  },
} as const;

export const orderService = {
  async getCart(userId: string) {
    const cartId = await getOrCreateCartId(userId);
    return prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            medicine: {
              include: {
                category: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  },

  async addCartItem(userId: string, input: AddCartItemInput): Promise<void> {
    const medicine = await prisma.medicine.findUnique({ where: { id: input.medicineId } });
    if (!medicine) {
      throw AppError.notFound("Medicine not found");
    }
    if (medicine.stock < input.quantity) {
      throw AppError.badRequest("Not enough stock available");
    }
    const cartId = await getOrCreateCartId(userId);
    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_medicineId: { cartId, medicineId: input.medicineId },
      },
    });
    const nextQty = (existing?.quantity ?? 0) + input.quantity;
    if (medicine.stock < nextQty) {
      throw AppError.badRequest("Not enough stock for requested quantity");
    }
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: nextQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          medicineId: input.medicineId,
          quantity: input.quantity,
        },
      });
    }
  },

  async patchCartItem(userId: string, medicineId: string, input: PatchCartItemInput): Promise<void> {
    const cartId = await getOrCreateCartId(userId);
    const item = await prisma.cartItem.findUnique({
      where: { cartId_medicineId: { cartId, medicineId } },
      include: { medicine: true },
    });
    if (!item) {
      throw AppError.notFound("Cart item not found");
    }
    if (item.medicine.stock < input.quantity) {
      throw AppError.badRequest("Not enough stock available");
    }
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: input.quantity },
    });
  },

  async removeCartItem(userId: string, medicineId: string): Promise<void> {
    const cartId = await getOrCreateCartId(userId);
    const item = await prisma.cartItem.findUnique({
      where: { cartId_medicineId: { cartId, medicineId } },
    });
    if (!item) {
      throw AppError.notFound("Cart item not found");
    }
    await prisma.cartItem.delete({ where: { id: item.id } });
  },

  async checkout(userId: string, input: CheckoutInput) {
    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: { include: { medicine: true } },
        },
      });
      if (!cart || cart.items.length === 0) {
        throw AppError.badRequest("Cart is empty");
      }
      for (const line of cart.items) {
        if (line.medicine.stock < line.quantity) {
          throw AppError.badRequest(`Insufficient stock for ${line.medicine.name}`);
        }
      }
      const totalPrice = cart.items.reduce(
        (sum, line) => sum + line.medicine.price * line.quantity,
        0,
      );
      const order = await tx.order.create({
        data: {
          userId,
          shippingAddress: input.shippingAddress,
          totalPrice,
          status: OrderStatus.PLACED,
          orderItems: {
            create: cart.items.map((line) => ({
              medicineId: line.medicineId,
              quantity: line.quantity,
              price: line.medicine.price,
            })),
          },
        },
      });
      for (const line of cart.items) {
        await tx.medicine.update({
          where: { id: line.medicineId },
          data: { stock: { decrement: line.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: orderDetailInclude,
      });
    });
    return result;
  },

  async listForCustomer(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: orderDetailInclude,
    });
  },

  async getForCustomer(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: orderDetailInclude,
    });
    if (!order) {
      throw AppError.notFound("Order not found");
    }
    return order;
  },

  async listForSeller(sellerId: string) {
    return prisma.order.findMany({
      where: {
        orderItems: { some: { medicine: { sellerId } } },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        },
        orderItems: {
          include: {
            medicine: {
              include: {
                category: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  },

  async listAllAdmin() {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        },
        orderItems: {
          include: {
            medicine: {
              include: {
                category: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  },

  async assertSellerOwnsLineInOrder(sellerId: string, orderId: string): Promise<void> {
    const hit = await prisma.orderItem.findFirst({
      where: { orderId, medicine: { sellerId } },
    });
    if (!hit) {
      throw AppError.forbidden("Order does not include your products");
    }
  },

  async updateStatusForSeller(sellerId: string, orderId: string, input: UpdateOrderStatusInput) {
    await orderService.assertSellerOwnsLineInOrder(sellerId, orderId);
    return prisma.order.update({
      where: { id: orderId },
      data: { status: input.status },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
        },
        orderItems: {
          include: {
            medicine: {
              include: {
                category: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  },

  async updateStatusAdmin(orderId: string, input: UpdateOrderStatusInput) {
    try {
      return await prisma.order.update({
        where: { id: orderId },
        data: { status: input.status },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
          },
          orderItems: {
            include: {
              medicine: {
                include: {
                  category: { select: { id: true, name: true } },
                  seller: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      });
    } catch {
      throw AppError.notFound("Order not found");
    }
  },
};
