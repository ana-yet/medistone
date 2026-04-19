import prisma from "../../prisma/client";
import { AppError } from "../../utils/errors";
import type { CreateMedicineInput, MedicineListQuery, UpdateMedicineInput } from "./medicine.validation";

const medicineInclude = {
  category: { select: { id: true, name: true } },
  seller: {
    select: { id: true, name: true, email: true },
  },
} as const;

export const medicineService = {
  async listPublic(query: MedicineListQuery) {
    const { page, limit, categoryId, search } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            name: { contains: search, mode: "insensitive" as const },
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: medicineInclude,
      }),
      prisma.medicine.count({ where }),
    ]);
    return { items, total, page, limit };
  },

  async getByIdPublic(id: string) {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        ...medicineInclude,
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { id: "desc" },
        },
      },
    });
    if (!medicine) {
      throw AppError.notFound("Medicine not found");
    }
    return medicine;
  },

  async assertSellerOwnsMedicine(sellerId: string, medicineId: string): Promise<void> {
    const med = await prisma.medicine.findFirst({
      where: { id: medicineId, sellerId },
    });
    if (!med) {
      throw AppError.notFound("Medicine not found");
    }
  },

  async createForSeller(sellerId: string, input: CreateMedicineInput) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw AppError.notFound("Category not found");
    }
    return prisma.medicine.create({
      data: {
        name: input.name,
        price: input.price,
        stock: input.stock,
        description: input.description,
        categoryId: input.categoryId,
        sellerId: sellerId,
      },
      include: medicineInclude,
    });
  },

  async listForSeller(sellerId: string) {
    return prisma.medicine.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
      include: medicineInclude,
    });
  },

  async getForSeller(sellerId: string, id: string) {
    const medicine = await prisma.medicine.findFirst({
      where: { id, sellerId },
      include: medicineInclude,
    });
    if (!medicine) {
      throw AppError.notFound("Medicine not found");
    }
    return medicine;
  },

  async updateForSeller(sellerId: string, id: string, input: UpdateMedicineInput) {
    await medicineService.assertSellerOwnsMedicine(sellerId, id);
    if (
      input.name === undefined &&
      input.price === undefined &&
      input.stock === undefined &&
      input.description === undefined &&
      input.categoryId === undefined
    ) {
      throw AppError.badRequest("No fields to update");
    }
    if (input.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
      if (!category) {
        throw AppError.notFound("Category not found");
      }
    }
    return prisma.medicine.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.stock !== undefined ? { stock: input.stock } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      },
      include: medicineInclude,
    });
  },

  async updateStockForSeller(sellerId: string, id: string, stock: number) {
    await medicineService.assertSellerOwnsMedicine(sellerId, id);
    return prisma.medicine.update({
      where: { id },
      data: { stock },
      include: medicineInclude,
    });
  },

  async deleteForSeller(sellerId: string, id: string): Promise<void> {
    await medicineService.assertSellerOwnsMedicine(sellerId, id);
    await prisma.medicine.delete({ where: { id } });
  },
};
