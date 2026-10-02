"use client";

import { useState } from "react";

const initialSignInFormState = {
  name: "",
  email: "",
  role: "consumer",
  store_name: "",
};

export default function SignIn() {
  const [signInForm, setSignInForm] = useState(initialSignInFormState);

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
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create an Account</h2>
      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={signInForm.name}
          onChange={(e) => handleSignInForm(e)}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={signInForm.email}
          onChange={(e) => handleSignInForm(e)}
        />

        {signInForm.role === "store" && (
          <input
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
        <button>Sign Up</button>
      </form>
    </div>
  );
}
