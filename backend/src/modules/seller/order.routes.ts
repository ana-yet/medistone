import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { validateBody, validateParams } from "../../middlewares/validate.middleware";
import { listSellerOrders, patchSellerOrderStatus } from "../order/order.controller";
import { orderIdParamSchema, updateOrderStatusSchema } from "../order/order.validation";

const router = Router();

router.get("/", asyncHandler(listSellerOrders));
router.patch(
  "/:orderId/status",
  validateParams(orderIdParamSchema),
  validateBody(updateOrderStatusSchema),
  asyncHandler(patchSellerOrderStatus),
);

export default router;
