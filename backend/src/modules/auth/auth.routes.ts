import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { validateBody } from "../../middlewares/validate.middleware";
import { login, register } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/register", validateBody(registerSchema), asyncHandler(register));
router.post("/login", validateBody(loginSchema), asyncHandler(login));

export default router;
