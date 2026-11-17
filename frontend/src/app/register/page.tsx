"use client";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuth } from "@/src/hooks/useAuth";
import { apiFetch } from "@/src/lib/api";
import { HOME_BY_ROLE } from "@/src/lib/routes";
import { LoginResponse } from "@/src/types/auth.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialSignInFormState = {
  name: "",
  role: "consumer",
  email: "",
  password: "",
  store_name: "",
};

export default function SignIn() {
  const [signInForm, setSignInForm] = useState(initialSignInFormState);
  const [error, setError] = useState<string | null>(null);
  const { saveSession } = useAuth();
  const router = useRouter();

  const handleSignInForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignInForm({
      ...signInForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(signInForm),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setError(data.message || "Couldn't create the account");
        return;
      }

      saveSession(data.user, data.token);
      router.push(HOME_BY_ROLE[data.user.role]);
    } catch (error) {
      console.error(error);
      setError("Couldn't create the account");
    }
  };

  return (
    <main className="h-dvh flex items-center justify-center">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <form
          action=""
          className="mt-4 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            name="name"
            placeholder="User Name"
            value={signInForm.name}
            onChange={(e) => handleSignInForm(e)}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={signInForm.email}
            onChange={(e) => handleSignInForm(e)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={signInForm.password}
            onChange={(e) => handleSignInForm(e)}
          />

          {signInForm.role === "store" && (
            <Input
              type="text"
              name="store_name"
              placeholder="Store Name"
              value={signInForm.store_name}
              onChange={(e) => handleSignInForm(e)}
            />
          )}

          <select
            name="role"
            id=""
            className="border border-gray-900 rounded-full py-2 px-4 cursor-pointer"
            value={signInForm.role}
            onChange={(e) => {
              setSignInForm({
                ...signInForm,
                role: e.target.value,
              });
            }}
          >
            <option value="consumer">Client</option>
            <option value="store">Store</option>
            <option value="delivery">Delivery</option>
          </select>
          {error && <p className="text-red-400">{error}</p>}
          <Button>Sign Up</Button>
        </form>
      </div>
    </main>
  );
}
