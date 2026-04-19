import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { validateBody, validateParams } from "../../middlewares/validate.middleware";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "./category.controller";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

const router = Router();

router.get("/", asyncHandler(listCategories));
router.post("/", validateBody(createCategorySchema), asyncHandler(createCategory));
router.patch(
  "/:id",
  validateParams(categoryIdParamSchema),
  validateBody(updateCategorySchema),
  asyncHandler(updateCategory),
);
router.delete(
  "/:id",
  validateParams(categoryIdParamSchema),
  asyncHandler(deleteCategory),
);

export default router;
