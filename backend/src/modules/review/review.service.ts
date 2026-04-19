import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "../../prisma/client";
import { AppError } from "../../utils/errors";
import type { CreateReviewInput } from "./review.validation";

export const reviewService = {
  async listForMedicine(medicineId: string) {
    const exists = await prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!exists) {
      throw AppError.notFound("Medicine not found");
    }
    return prisma.review.findMany({
      where: { medicineId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { id: "desc" },
    });
  },

  async createForCustomer(userId: string, input: CreateReviewInput) {
    const delivered = await prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DELIVERED,
        orderItems: { some: { medicineId: input.medicineId } },
      },
    });
    if (!delivered) {
      throw AppError.forbidden("You can only review medicines from delivered orders");
    }
    const medicine = await prisma.medicine.findUnique({ where: { id: input.medicineId } });
    if (!medicine) {
      throw AppError.notFound("Medicine not found");
    }
    try {
      return await prisma.review.create({
        data: {
          userId,
          medicineId: input.medicineId,
          rating: input.rating,
          comment: input.comment,
        },
        include: { user: { select: { id: true, name: true } } },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw AppError.conflict("You have already reviewed this medicine");
      }
      throw e;
    }
  },
};
