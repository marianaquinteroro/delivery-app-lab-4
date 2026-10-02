import Boom from "@hapi/boom";
import { Request, Response } from "express";
import { loginService } from "./auth.service";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    throw Boom.badRequest("Email is required");
  }
  if (!password) {
    throw Boom.badRequest("Email is required");
  }
  const userLogged = await loginService({ email, password });

  res.status(200).json(userLogged);
};
