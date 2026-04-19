import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { authenticate } from "../../middlewares/auth.middleware";
import { getMe } from "./user.controller";

const router = Router();

router.get("/me", authenticate, asyncHandler(getMe));

export default router;
