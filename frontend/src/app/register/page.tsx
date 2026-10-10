"use client";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuth } from "@/src/hooks/useAuth";
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
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
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

    // console.log(signInForm);

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(signInForm),
      });

      const data = await res.json();

      if (data.statusCode === 400) {
        setError(data.message)
      }

      console.log(data);

      setUser(data);

      switch (data.role) {
        case "consumer":
          router.push("/client");
          break;
        case "store":
          router.push("/store-admin");
          break;
        case "delivery":
          router.push("/delivery");
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
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
            type="text"
            name="email"
            placeholder="Email"
            value={signInForm.email}
            onChange={(e) => handleSignInForm(e)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
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
          <Button>Sing Up</Button>
        </form>
      </div>
    </main>
  );
}
