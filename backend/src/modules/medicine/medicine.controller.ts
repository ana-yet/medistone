import type { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { ok } from "../../utils/response";
import type { MedicineListQuery } from "./medicine.validation";

export const listMedicinesPublic = async (req: Request, res: Response): Promise<void> => {
  const query = req.validatedQuery as MedicineListQuery;
  const result = await medicineService.listPublic(query);
  res.status(200).json(ok(result));
};

export const getMedicinePublic = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const medicine = await medicineService.getByIdPublic(id);
  res.status(200).json(ok(medicine));
};
