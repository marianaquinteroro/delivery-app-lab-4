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
  const { name, email, role, store_name } = req.body;

  console.log(store_name);
  

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
    throw Boom.badRequest("Store name is required");
  }

  const userObj = {
    name,
    role,
    email,
    store_name,
  };

  const newUser = await CreateUserService(userObj);
  res.status(201).json(newUser);
};
