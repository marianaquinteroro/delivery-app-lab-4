"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { LoginResponse } from "@/src/types/auth.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialLoginFormState = {
  email: "",
  password: "",
};

export default function Login() {
  const [loginForm, setLoginForm] = useState(initialLoginFormState);
  const { setUser } = useAuth();
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
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Incorrect Email or Password");
      }

      console.log(data.user);
      setUser(data.user);

      switch (data.user.role) {
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
    <div>
      <h2>Hello from Login</h2>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginForm.email}
          onChange={(e) => handleLoginForm(e)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => handleLoginForm(e)}
        />
        <button>Log In</button>
      </form>
    </div>
  );
}
