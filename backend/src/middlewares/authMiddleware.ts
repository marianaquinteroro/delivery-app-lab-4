import Boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";
import { getUserProfileByIdRepository } from "../features/auth/auth.repository";
import { AuthUser, UserRole } from "../features/auth/auth.types";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw Boom.unauthorized("Missing authorization token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw Boom.unauthorized("Invalid or expired token");
  }

  const profile = await getUserProfileByIdRepository(data.user.id);

  if (!profile) {
    throw Boom.unauthorized("User profile not found");
  }

  req.user = profile;
  next();
};

export const getAuthUser = (req: Request): AuthUser => {
  if (!req.user) {
    throw Boom.unauthorized("Not authenticated");
  }
  return req.user;
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = getAuthUser(req);

    if (!roles.includes(user.role)) {
      throw Boom.forbidden(`Only ${roles.join(", ")} users can do this`);
    }

    next();
  };
