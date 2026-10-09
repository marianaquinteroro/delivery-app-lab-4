"use client";

import { useStore } from "@/src/hooks/stores/useStore";
import { useAuth } from "@/src/hooks/useAuth";
import { Product } from "@/src/types/stores.types";
import Link from "next/link";
import { useState } from "react";

export default function Store() {
  const { user, isLoading } = useAuth();
  const {
    storeDetail,
    isLoadingStoreDetail,
    updateStoreStatus,
    isUpdatingStatus,
    statusError,
    updateProduct,
    isUpdatingProduct,
  } = useStore(String(user?.id));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditingName(product.name);
    setEditingPrice(String(product.price));
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setEditingPrice("");
    setFormError(null);
  };

  const handleSaveProduct = async (productId: string) => {
    const name = editingName.trim();
    const price = Number(editingPrice);

    const errorMessage = await updateProduct(productId, name, price);

    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }

    cancelEditing();
  };

  if (isLoading || isLoadingStoreDetail) {
    return <section>Loading...</section>;
  }

  return (
    <div>
      <h2>
        {storeDetail?.store.name} is{" "}
        {storeDetail?.store.is_open ? "Open" : "Closed"}
      </h2>
      <div>
        <button onClick={updateStoreStatus} disabled={isUpdatingStatus}>
          {storeDetail?.store.is_open ? "Close store" : "Open store"}
        </button>
        {statusError && <p>{statusError}</p>}
      </div>
      <section>
        <Link href="/store-admin/create-product">Create a product</Link>
        {storeDetail?.products.length === 0 ? (
          <p>No products</p>
        ) : (
          <section>
            <p>{storeDetail?.store.name} Products</p>
            {storeDetail?.products.map((product) => (
              <article key={product.id}>
                {editingId === product.id ? (
                  <>
                    <input
                      type="text"
                      placeholder="Product name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                    />
                    <button
                      onClick={() => handleSaveProduct(product.id)}
                      disabled={isUpdatingProduct}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isUpdatingProduct}
                    >
                      Cancel
                    </button>
                    {formError && <p>{formError}</p>}
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(product)}>Edit</button>
                    <p>{product.name}</p>
                    <p>${product.price}</p>
                  </>
                )}
              </article>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}
