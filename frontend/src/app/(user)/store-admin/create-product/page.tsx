"use client";

import { useStore } from "@/src/hooks/stores/useStore";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

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
    <main className="flex flex-col items-center justify-center h-dvh">
      <h2 className="text-2xl font-bold">Create a product</h2>
      <form
        onSubmit={(e) => handleProductSubmit(e)}
        className="flex flex-col p-4 gap-4"
      >
        <Input
          type="text"
          name="productName"
          value={productName}
          placeholder="Product Name"
          onChange={(e) => setProductName(e.target.value)}
        />
        <Input
          type="number"
          name="productName"
          value={productPrice}
          placeholder="Product Price"
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <Button disabled={!isValidProduct}>Create</Button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
