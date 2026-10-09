"use client";

import { useStore } from "@/src/hooks/stores/useStore";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { createProduct, productError } = useStore(String(user?.id));

  const isValidProduct = productName !== "";

  const handleProductSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const created = await createProduct(productName, Number(productPrice));

    if (!created) {
      setError(productError);
    } else if (created) {
      setProductName("");
      setProductPrice("");
      setError("");
      alert("Product created");
      router.push("/store-admin");
    }
    console.log("form", { productName, productPrice });
  };

  return (
    <div>
      <h2>Create a product</h2>
      <form onSubmit={(e) => handleProductSubmit(e)}>
        <input
          type="text"
          value={productName}
          placeholder="Product Name"
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          min="0"
          value={productPrice}
          placeholder="Product Price"
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <button
          className="bg-blue-300 disabled:bg-red-200"
          disabled={!isValidProduct}
        >
          Create
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
