import { Request, Response } from "express";
import {
  CreateUserService,
  getUserByIdService,
  getUsersService,
} from "./users.service";
import Boom from "@hapi/boom";

export const getUsersController = async (_req: Request, res: Response) => {
  const users = await getUsersService();

  res.status(200).json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(String(id));

  res.status(200).json(user);
};

export const createUserController = async (req: Request, res: Response) => {
  const { name, email, role, password, store_name } = req.body;

  if (!name) {
    throw Boom.badRequest("Name is required");
  }

  if (!role) {
    throw Boom.badRequest("Role is required");
  }

  if (!email) {
    throw Boom.badRequest("Email is required");
  }

  if (role === "store" && !store_name) {
    throw Boom.badRequest("Store Name is required");
  }

  if (!password) {
    throw Boom.badRequest("Password is required");
  }

  const newUser = await CreateUserService({ name, email, role, password, store_name });
  res.status(201).json(newUser);
};
