import { Router } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "../../utils/async-handler";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/role.middleware";
import { validateBody, validateParams } from "../../middlewares/validate.middleware";
import {
  checkout,
  deleteCartItem,
  getCart,
  getMyOrder,
  listMyOrders,
  patchCartItem,
  postCartItem,
} from "./order.controller";
import {
  addCartItemSchema,
  cartMedicineParamSchema,
  checkoutSchema,
  orderIdParamSchema,
  patchCartItemSchema,
} from "./order.validation";

const router = Router();

router.use(authenticate, requireRoles(Role.CUSTOMER));

router.get("/cart", asyncHandler(getCart));
router.post("/cart/items", validateBody(addCartItemSchema), asyncHandler(postCartItem));
router.patch(
  "/cart/items/:medicineId",
  validateParams(cartMedicineParamSchema),
  validateBody(patchCartItemSchema),
  asyncHandler(patchCartItem),
);
router.delete(
  "/cart/items/:medicineId",
  validateParams(cartMedicineParamSchema),
  asyncHandler(deleteCartItem),
);

router.post("/", validateBody(checkoutSchema), asyncHandler(checkout));
router.get("/", asyncHandler(listMyOrders));
router.get("/:orderId", validateParams(orderIdParamSchema), asyncHandler(getMyOrder));

export default router;
