import { Router } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "../../utils/async-handler";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/role.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import { createReview } from "./review.controller";
import { createReviewSchema } from "./review.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRoles(Role.CUSTOMER),
  validateBody(createReviewSchema),
  asyncHandler(createReview),
);

export default router;
