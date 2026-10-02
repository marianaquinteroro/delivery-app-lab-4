import Boom from "@hapi/boom";
import {
  createUserRepository,
  getUserByIdRepository,
  getUsersRepository,
} from "./users.repositor";
import { CreateUserDTO } from "./users.types";

export const getUsersService = async () => {
  const users = await getUsersRepository();
  if (users.length === 0) {
    throw Boom.badRequest("No users found");
  }
  return users;
};

export const getUserByIdService = async (id: string) => {
  const user = await getUserByIdRepository(id);
  if (!user) {
    throw Boom.badRequest("User Not Found");
  }
  return user;
};

export const CreateUserService = async (user: CreateUserDTO) => {
  const newUser = await createUserRepository(user);
  return newUser;
};
