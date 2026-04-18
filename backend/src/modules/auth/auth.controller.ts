import { Request, Response } from "express";
import { authService } from "./auth.service";


export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};