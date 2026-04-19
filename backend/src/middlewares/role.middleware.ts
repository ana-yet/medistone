import type { RequestHandler } from "express";
import type { Role } from "@prisma/client";
import { AppError } from "../utils/errors";

export function requireRoles(...allowed: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(AppError.unauthorized());
      return;
    }
    if (!allowed.includes(req.user.role)) {
      next(AppError.forbidden());
      return;
    }
    next();
  };
}
