import { Request, Response } from "express";
import { getUserByIdService, getUsersService } from "./users.service";

export const getUsersController = async (_req: Request, res: Response) => {
  const users = await getUsersService();

  res.status(200).json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(String(id));

  res.status(200).json(user);
};
