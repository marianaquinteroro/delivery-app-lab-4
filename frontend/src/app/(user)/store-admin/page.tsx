"use client";

import { Loader } from "@/src/components/ui/Loader";
import { Status } from "@/src/components/ui/Status";
import { useStore } from "@/src/hooks/stores/useStore";
import { useAuth } from "@/src/hooks/useAuth";
import { Product } from "@/src/types/stores.types";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { StoreOrdersList } from "@/src/components/store/StoreOrdersList";

export default function Store() {
  const { user, isLoading } = useAuth();
  const {
    storeDetail,
    isLoadingStoreDetail,
    updateStoreStatus,
    isUpdatingStatus,
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
    return (
      <main className="flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  return (
    <main className="m-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{storeDetail?.store.name}</h2>
        <Status isOpen={storeDetail?.store.is_open || false} />
      </div>
      <div className="flex items-center gap-3 mt-4">
        <Button onClick={updateStoreStatus} disabled={isUpdatingStatus}>
          {storeDetail?.store.is_open ? "Close store" : "Open store"}
        </Button>
        <Link className="hover:underline" href="/store-admin/create-product">
          Create a product
        </Link>
      </div>
      <section>
        {storeDetail?.products.length === 0 ? (
          <p>No products</p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* <p>Products</p> */}
            {storeDetail?.products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl p-4 border border-gray-900"
              >
                {editingId === product.id ? (
                  <>
                    <Input
                      type="text"
                      placeholder="Product name"
                      name="productName"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                    <Input
                      type="number"
                      name=""
                      placeholder="Price"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                    />
                    <Button
                      onClick={() => handleSaveProduct(product.id)}
                      disabled={isUpdatingProduct}
                    >
                      Save
                    </Button>
                    <Button
                      secondary
                      onClick={cancelEditing}
                      disabled={isUpdatingProduct}
                    >
                      Cancel
                    </Button>
                    {formError && <p>{formError}</p>}
                  </>
                ) : (
                  <>
                    <p className="text-xl">{product.name}</p>
                    <p className="">${product.price}</p>
                    <Button onClick={() => startEditing(product)}>Edit</Button>
                  </>
                )}
              </article>
            ))}
          </section>
        )}
      </section>
      {storeDetail && <StoreOrdersList storeId={storeDetail.store.id} />}
    </main>
  );
}
