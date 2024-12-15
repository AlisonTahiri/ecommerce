import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";
import { MY_ORDERS_QUERYResult, Order } from "@/sanity.types";
import Image from "next/image";
import React from "react";

const OrderCard = ({ order }: { order: MY_ORDERS_QUERYResult[number] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
          <p className="text-sm text-gray-600 mb-1 font-bold">Order Number</p>
          <p className="font-mono text-sm text-green-600 break-all">
            {order.orderNumber}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-gray-600 mb-1">Order Date</p>
          <p className="font-medium">
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <span
              className={cn(
                `px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800`,
                {
                  "bg-green-100 text-green-800": order.status === "paid",
                }
              )}
            >
              {order.status}
            </span>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="font-bold text-lg">
              {formatCurrency(order.totalPrice ?? 0, order.currency)}
            </p>
          </div>
        </div>

        {order.discountAmount ? (
          <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
              Discount Applied:{" "}
              {formatCurrency(order.discountAmount, order.currency)}
            </p>
            <p className="text-sm text-gray-600">
              Original Subtotal:{" "}
              {formatCurrency(
                (order.totalPrice || 0) + order.discountAmount,
                order.currency
              )}
            </p>
          </div>
        ) : null}
      </div>

      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <p className="text-sm text-gray-600 font-semibold mb-3 sm:mb-4">
          Order Items
        </p>

        <div className="space-y-3 sm:space-y-4">
          {order.products?.map((product) => (
            <div
              key={product.product?._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {product.product?.image && (
                  <Image
                    src={imageUrl(product.product.image).url()}
                    alt={product.product.name || "Product Image"}
                    className="object-cover"
                    width={100}
                    height={100}
                  />
                )}

                <div>
                  <p className="font-medium text-sm sm:text-base">
                    {product.product?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity ?? "N/A"}
                  </p>
                </div>
              </div>
              <p className="font-medium text-right">
                {product.product?.price && product.quantity
                  ? formatCurrency(
                      product.product.price * product.quantity,
                      order.currency
                    )
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
