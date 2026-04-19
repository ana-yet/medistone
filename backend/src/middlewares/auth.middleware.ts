import type { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/errors";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(AppError.unauthorized("Missing or invalid Authorization header"));
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    next(AppError.unauthorized("Missing bearer token"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired token"));
  }
};
