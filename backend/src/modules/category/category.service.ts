import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";
import { AppError } from "../../utils/errors";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.validation";

export const categoryService = {
  async list() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },

  async create(input: CreateCategoryInput) {
    try {
      return await prisma.category.create({ data: { name: input.name } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw AppError.conflict("Category name already exists");
      }
      throw e;
    }
  },

  async update(id: string, input: UpdateCategoryInput) {
    try {
      return await prisma.category.update({
        where: { id },
        data: { name: input.name },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw AppError.notFound("Category not found");
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw AppError.conflict("Category name already exists");
      }
      throw e;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await prisma.category.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw AppError.notFound("Category not found");
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw AppError.conflict("Category is still referenced by medicines");
      }
      throw e;
    }
  },
};
