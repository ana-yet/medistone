import type { Request, Response } from "express";
import { categoryService } from "./category.service";
import { created, ok } from "../../utils/response";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.validation";

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await categoryService.list();
  res.status(200).json(ok(categories));
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateCategoryInput;
  const category = await categoryService.create(body);
  res.status(201).json(created(category));
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateCategoryInput;
  const category = await categoryService.update(id, body);
  res.status(200).json(ok(category));
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  await categoryService.remove(id);
  res.status(204).send();
};
