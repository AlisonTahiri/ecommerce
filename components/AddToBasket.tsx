"use client";

import useBasketStore from "@/app/(store)/store";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import { useEffect, useState } from "react";

type AddToBasketButtonProps = {
  product: Product;
  disabled?: boolean;
};

const AddToBasketButton = ({ product, disabled }: AddToBasketButtonProps) => {
  const { addItem, removeItem, getItemCount } = useBasketStore();

  const itemCount = getItemCount(product._id);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 bg-gray-200",
          {
            "bg-gray-100": itemCount === 0,
          }
        )}
        onClick={() => removeItem(product._id)}
        disabled={itemCount === 0 || disabled}
      >
        <span
          className={cn("text-xl font-bold text-gray-600", {
            "text-gray-400": itemCount === 0,
          })}
        >
          -
        </span>
      </button>
      <span className="text-gray-600">{itemCount}</span>
      <button
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 bg-blue-500 hover:bg-blue-600",
          {
            "bg-gray-400 cursor-not-allowed": disabled,
          }
        )}
        onClick={() => addItem(product)}
        disabled={disabled}
      >
        <span className="text-xl font-bold text-white">+</span>
      </button>
    </div>
  );
};

export default AddToBasketButton;
