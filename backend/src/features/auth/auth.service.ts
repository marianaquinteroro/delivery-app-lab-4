import Boom from "@hapi/boom";
import { loginRepository } from "./auth.repository";
import { LoginDTO } from "./auth.types";

export const loginService = async (credentials: LoginDTO) => {
  const user = await loginRepository(credentials);

  if (!user) {
    throw Boom.badRequest("Incorrect email or password");
  }
  return user;
};
