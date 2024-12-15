"use server";

import stripe from "@/lib/stripe";
import { BasketItem } from "../(store)/store";
import { imageUrl } from "@/lib/imageUrl";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export const createCheckoutSession = async ({
  items,
  metadata,
}: {
  items: GroupedBasketItem[];
  metadata: Metadata;
}) => {
  try {
    const itemsWithoutPrice = items.filter(
      (item) => !item.product.price || item.product.price === 0
    );

    if (itemsWithoutPrice.length > 0) {
      throw new Error(
        `The following items do not have a price: ${itemsWithoutPrice
          .map((item) => item.product.name)
          .join(", ")}`
      );
    }

    // Search for existing customer by email

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      // }

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_creation: customerId ? undefined : "always",
        customer_email: !customerId ? metadata.customerEmail : undefined,
        metadata,
        mode: "payment",
        allow_promotion_codes: true,
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
        cancel_url: `${baseUrl}/basket`,
        line_items: items.map((item) => ({
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.product.price! * 100),
            product_data: {
              name: item.product.name || "Unnamed Product",
              description: `Product ID: ${item.product._id}`,
              metadata: {
                id: item.product._id,
              },
              images: item.product.image
                ? [imageUrl(item.product.image).url()]
                : undefined,
            },
          },
          quantity: item.quantity,
        })),
      });

      return session.url;
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
