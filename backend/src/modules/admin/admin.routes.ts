import { Router } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "../../utils/async-handler";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/role.middleware";
import { validateBody, validateParams } from "../../middlewares/validate.middleware";
import categoryRoutes from "../category/category.routes";
import {
  createUserAdmin,
  listUsersAdmin,
  patchUserStatusAdmin,
} from "../user/user.controller";
import { adminCreateUserSchema } from "../user/user.admin.validation";
import {
  listAllOrdersAdmin,
  patchAdminOrderStatus,
} from "../order/order.controller";
import { orderIdParamSchema, updateOrderStatusSchema } from "../order/order.validation";
import { updateUserStatusSchema, userIdParamSchema } from "../user/user.validation";

const router = Router();

router.use(authenticate, requireRoles(Role.ADMIN));

router.use("/categories", categoryRoutes);

router.get("/users", asyncHandler(listUsersAdmin));
router.post("/users", validateBody(adminCreateUserSchema), asyncHandler(createUserAdmin));
router.patch(
  "/users/:id/status",
  validateParams(userIdParamSchema),
  validateBody(updateUserStatusSchema),
  asyncHandler(patchUserStatusAdmin),
);

router.get("/orders", asyncHandler(listAllOrdersAdmin));
router.patch(
  "/orders/:orderId/status",
  validateParams(orderIdParamSchema),
  validateBody(updateOrderStatusSchema),
  asyncHandler(patchAdminOrderStatus),
);

export default router;
