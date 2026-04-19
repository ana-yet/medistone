import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/errors";

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(AppError.badRequest("Invalid request body", parsed.error.flatten()));
      return;
    }
    req.body = parsed.data as Request["body"];
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      next(AppError.badRequest("Invalid query parameters", parsed.error.flatten()));
      return;
    }
    req.validatedQuery = parsed.data;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      next(AppError.badRequest("Invalid route parameters", parsed.error.flatten()));
      return;
    }
    req.params = parsed.data as Request["params"];
    next();
  };
}
