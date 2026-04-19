import type { Request, Response } from "express";
import { medicineService } from "../medicine/medicine.service";
import { AppError } from "../../utils/errors";
import { created, ok } from "../../utils/response";
import type {
  CreateMedicineInput,
  UpdateMedicineInput,
  UpdateStockInput,
} from "../medicine/medicine.validation";

function sellerId(req: Request): string {
  const id = req.user?.id;
  if (!id) {
    throw AppError.unauthorized();
  }
  return id;
}

export const listMyMedicines = async (req: Request, res: Response): Promise<void> => {
  const items = await medicineService.listForSeller(sellerId(req));
  res.status(200).json(ok(items));
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateMedicineInput;
  const medicine = await medicineService.createForSeller(sellerId(req), body);
  res.status(201).json(created(medicine));
};

export const getMyMedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const medicine = await medicineService.getForSeller(sellerId(req), id);
  res.status(200).json(ok(medicine));
};

export const updateMyMedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateMedicineInput;
  const medicine = await medicineService.updateForSeller(sellerId(req), id, body);
  res.status(200).json(ok(medicine));
};

export const patchMyMedicineStock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateStockInput;
  const medicine = await medicineService.updateStockForSeller(sellerId(req), id, body.stock);
  res.status(200).json(ok(medicine));
};

export const deleteMyMedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  await medicineService.deleteForSeller(sellerId(req), id);
  res.status(204).send();
};
