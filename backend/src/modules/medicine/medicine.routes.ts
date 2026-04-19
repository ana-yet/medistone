import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { validateParams, validateQuery } from "../../middlewares/validate.middleware";
import { listReviewsForMedicine } from "../review/review.controller";
import { getMedicinePublic, listMedicinesPublic } from "./medicine.controller";
import { medicineIdParamSchema, medicineListQuerySchema } from "./medicine.validation";

const router = Router();

router.get("/", validateQuery(medicineListQuerySchema), asyncHandler(listMedicinesPublic));
router.get(
  "/:id/reviews",
  validateParams(medicineIdParamSchema),
  asyncHandler(listReviewsForMedicine),
);
router.get(
  "/:id",
  validateParams(medicineIdParamSchema),
  asyncHandler(getMedicinePublic),
);

export default router;
