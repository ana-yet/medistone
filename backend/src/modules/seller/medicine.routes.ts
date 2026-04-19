import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { validateBody, validateParams } from "../../middlewares/validate.middleware";
import {
  createMedicine,
  deleteMyMedicine,
  getMyMedicine,
  listMyMedicines,
  patchMyMedicineStock,
  updateMyMedicine,
} from "./medicine.controller";
import {
  createMedicineSchema,
  medicineIdParamSchema,
  updateMedicineSchema,
  updateStockSchema,
} from "../medicine/medicine.validation";

const router = Router();

router.get("/", asyncHandler(listMyMedicines));
router.post("/", validateBody(createMedicineSchema), asyncHandler(createMedicine));
router.get("/:id", validateParams(medicineIdParamSchema), asyncHandler(getMyMedicine));
router.patch(
  "/:id",
  validateParams(medicineIdParamSchema),
  validateBody(updateMedicineSchema),
  asyncHandler(updateMyMedicine),
);
router.patch(
  "/:id/stock",
  validateParams(medicineIdParamSchema),
  validateBody(updateStockSchema),
  asyncHandler(patchMyMedicineStock),
);
router.delete("/:id", validateParams(medicineIdParamSchema), asyncHandler(deleteMyMedicine));

export default router;
