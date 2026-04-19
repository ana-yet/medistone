import { Router } from "express";
import adminRoutes from "../modules/admin/admin.routes";
import authRoutes from "../modules/auth/auth.routes";
import medicineRoutes from "../modules/medicine/medicine.routes";
import orderRoutes from "../modules/order/order.routes";
import reviewRoutes from "../modules/review/review.routes";
import sellerRoutes from "../modules/seller/seller.routes";
import userRoutes from "../modules/user/user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/medicines", medicineRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/seller", sellerRoutes);
router.use("/admin", adminRoutes);

export default router;
