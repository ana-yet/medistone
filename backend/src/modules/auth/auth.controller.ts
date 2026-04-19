import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { created, ok } from "../../utils/response";
import type { LoginInput, RegisterInput } from "./auth.validation";

export const register = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as RegisterInput;
  const result = await authService.register(body);
  res.status(201).json(created(result));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as LoginInput;
  const result = await authService.login(body);
  res.status(200).json(ok(result));
};
