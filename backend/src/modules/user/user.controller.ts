import type { Request, Response } from "express";
import { userService } from "./user.service";
import { AppError } from "../../utils/errors";
import { created, ok } from "../../utils/response";
import type { UpdateUserStatusInput } from "./user.validation";
import type { AdminCreateUserInput } from "./user.admin.validation";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized();
  }
  const profile = await userService.getProfile(userId);
  res.status(200).json(ok(profile));
};

export const listUsersAdmin = async (_req: Request, res: Response): Promise<void> => {
  const users = await userService.listAll();
  res.status(200).json(ok(users));
};

export const patchUserStatusAdmin = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateUserStatusInput;
  const user = await userService.setStatus(id, body);
  res.status(200).json(ok(user));
};

export const createUserAdmin = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as AdminCreateUserInput;
  const user = await userService.createStaffUser(body);
  res.status(201).json(created(user));
};
