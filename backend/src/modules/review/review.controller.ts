import type { Request, Response } from "express";
import { reviewService } from "./review.service";
import { AppError } from "../../utils/errors";
import { created, ok } from "../../utils/response";
import type { CreateReviewInput } from "./review.validation";

export const listReviewsForMedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const reviews = await reviewService.listForMedicine(id);
  res.status(200).json(ok(reviews));
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized();
  }
  const body = req.body as CreateReviewInput;
  const review = await reviewService.createForCustomer(userId, body);
  res.status(201).json(created(review));
};
