"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { apiFetch } from "@/src/lib/api";
import { HOME_BY_ROLE } from "@/src/lib/routes";
import { LoginResponse } from "@/src/types/auth.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

const initialLoginFormState = {
  email: "",
  password: "",
};

export default function Login() {
  const [loginForm, setLoginForm] = useState(initialLoginFormState);
  const [error, setError] = useState(false);
  const { saveSession } = useAuth();
  const router = useRouter();

  const handleLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setError(true);
        return;
      }

      saveSession(data.user, data.token);
      router.push(HOME_BY_ROLE[data.user.role]);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const isValid =
    loginForm.email.trim() !== "" && loginForm.password.trim() !== "";

  return (
    <main className="h-dvh flex items-center justify-center">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold">Welcome Back!</h2>
        <form
          action=""
          className="mt-4 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => handleLoginForm(e)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => handleLoginForm(e)}
          />
          {error && <p className="text-red-400">Incorrect Email or Password</p>}

          <Button disabled={!isValid}>Log In</Button>
        </form>
      </div>
    </main>
  );
}
