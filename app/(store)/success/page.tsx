"use client";

import { useSearchParams } from "next/navigation";
import useBasketStore from "../store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 text-center rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            {/*thin tick svg  */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Your order has been confirmed and will be shipped shortly.
          </p>
          <div className="space-y-2">
            {orderNumber && (
              <p className="text-gray-600">
                <span>Order Number: </span>
                <span className="font-mono text-sm text-green-600">
                  {orderNumber}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
