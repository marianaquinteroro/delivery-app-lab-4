"use client";

import { useState } from "react";

const initialLoginFormState = {
  name: "",
  email: "",
};

export default function Login() {
  const [loginForm, setLoginForm] = useState(initialLoginFormState);

  const handleLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(loginForm);
  };

  return (
    <div>
      <h2>Hello from Login</h2>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={loginForm.name}
          onChange={(e) => handleLoginForm(e)}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={loginForm.email}
          onChange={(e) => handleLoginForm(e)}
        />
        <button>Log In</button>
      </form>
    </div>
  );
}
