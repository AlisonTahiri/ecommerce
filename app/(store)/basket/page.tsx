"use client";

import React, { useEffect, useState } from "react";
import useBasketStore from "../store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AddToBasketButton from "@/components/AddToBasket";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Loader from "@/components/Loader";
import {
  createCheckoutSession,
  Metadata,
} from "@/app/actions/createCheckoutSession";

const BasketPage = () => {
  const groupItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (groupItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Basket</h1>
        <p className="text-gray-600 text-lg">Your basket is empty.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return;

    const items = groupItems.filter((item) => item.quantity > 0);
    if (items.length === 0) return;
    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      // filter out items with quantity 0

      const checkoutUrl = await createCheckoutSession({
        items,
        metadata,
      });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {groupItems.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center justify-between gap-4"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-w-0"
                onClick={() =>
                  router.push(`/products/${item.product.slug?.current}`)
                }
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                  {item.product.image && (
                    <Image
                      src={imageUrl(item.product.image).url()}
                      alt={item.product.name || "Product Image"}
                      className="object-cover w-full h-full rounded"
                      width={96}
                      height={96}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold sm:text-xl truncate">
                    {item.product.name}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Price: $
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center full flex-shrink-0">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>
                {groupItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>

            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                ${useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>

          {isSignedIn ? (
            <button
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
              onClick={handleCheckout}
            >
              {loading ? "Loading..." : "Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl={"/basket"}>
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>

        <div className="h-64 lg:h-0">
          {/* Spacer for fixed checkout on mobile */}
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
