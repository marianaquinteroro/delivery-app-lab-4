import Boom from "@hapi/boom";
import { Request, Response } from "express";
import { loginService, registerService } from "./auth.service";
import { UserRole } from "./auth.types";

const VALID_ROLES: UserRole[] = ["consumer", "store", "delivery"];

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw Boom.badRequest("Email is required");
  }
  if (!password) {
    throw Boom.badRequest("Password is required");
  }

  const result = await loginService({ email, password });
  res.status(200).json(result);
};

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, role, store_name } = req.body;

  if (!name) {
    throw Boom.badRequest("Name is required");
  }
  if (!email) {
    throw Boom.badRequest("Email is required");
  }
  if (!password) {
    throw Boom.badRequest("Password is required");
  }
  if (!VALID_ROLES.includes(role)) {
    throw Boom.badRequest("Role must be consumer, store or delivery");
  }
  if (role === "store" && !store_name) {
    throw Boom.badRequest("Store Name is required");
  }

  const result = await registerService({
    name,
    email,
    password,
    role,
    store_name,
  });
  res.status(201).json(result);
};
