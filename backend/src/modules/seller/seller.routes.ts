import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/role.middleware";
import medicineRoutes from "./medicine.routes";
import orderRoutes from "./order.routes";

const router = Router();

router.use(authenticate, requireRoles(Role.SELLER));
router.use("/medicines", medicineRoutes);
router.use("/orders", orderRoutes);

export default router;
