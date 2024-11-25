import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16",
  });

  interface User {
    email: string;
    stripeCustomerId: string;
  }

  interface Session {
    callbacks?: any;
    user?: User;
    expires?: string;
  }

  const session = (await getServerSession(req, res, authOptions)) as Session;
  const customer = req.body.user;
  const cartItems = req.body.items;

  if (!Array.isArray(cartItems)) {
    // Handle the case where cartItems is not an array
    return res.status(400).json({
      error: {
        code: "invalid-request",
        message: "cartItems must be an array.",
      },
    });
  }

  const lineItems = cartItems.map(
    (item: { sku: string; quantity: number }) => ({
      price: item.sku,
      quantity: item.quantity,
    })
  );

  // Error handling
  if (!session?.user) {
    return res.status(401).json({
      error: {
        code: "no-access",
        message: "You are not signed in.",
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer,
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/?cancelledPayment=true`,
    subscription_data: {
      metadata: {},
    },
  });

  if (!checkoutSession.url) {
    return res.status(500).json({
      cpde: "stripe-error",
      error: "Could not create checkout session",
    });
  }

  return res.status(200).json({ redirectUrl: checkoutSession.url });
};
