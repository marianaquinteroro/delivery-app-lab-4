import Boom from "@hapi/boom";
import { createAuthClient, supabase } from "../../config/supabase";
import { CreateUserService } from "../users/users.service";
import { getUserProfileByIdRepository } from "./auth.repository";
import { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";

const signInWithSupabase = async ({ email, password }: LoginDTO) => {
  const authClient = createAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw Boom.unauthorized("Incorrect email or password");
  }

  return data.session;
};

export const loginService = async (
  credentials: LoginDTO,
): Promise<AuthResponse> => {
  const session = await signInWithSupabase(credentials);
  const user = await getUserProfileByIdRepository(session.user.id);

  if (!user) {
    throw Boom.notFound("User profile not found");
  }

  return { user, token: session.access_token };
};

export const registerService = async (
  data: RegisterDTO,
): Promise<AuthResponse> => {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: { name: data.name, role: data.role },
  });

  if (error || !created.user) {
    throw Boom.badRequest(error?.message ?? "Could not create user");
  }

  try {
    const user = await CreateUserService({
      id: created.user.id,
      name: data.name,
      email: data.email,
      role: data.role,
      store_name: data.store_name,
    });

    const session = await signInWithSupabase(data);
    return { user, token: session.access_token };
  } catch (err) {
    await supabase.auth.admin.deleteUser(created.user.id);
    throw err;
  }
};
