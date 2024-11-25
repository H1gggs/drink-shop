import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { prisma } from "../../../../lib/prisma";

const endpointSecret = "whsec_436d29ade9cd9657c765da9d150871614e61384bcade0a3c208501a61a2c5c9b";

export const config = {
  api: {
    bodyParser: false,
  },
};

type User = {
  id: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method == "POST") {
    try {
      const requestBuffer = await buffer(req);
      const sig = req.headers["stripe-signature"] as string;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2023-08-16",
      });
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          requestBuffer.toString(),
          sig,
          endpointSecret
        );
        console.log(`✅  Webhook signature verified!`, event.id);
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook signature verification failed.`);
      }

      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object as any;
          const stripeCustomerId = paymentIntent.customer as string;
          const metadata = paymentIntent.metadata;

          const customer = await stripe.customers.retrieve(stripeCustomerId);
          
          if (customer && "email" in customer) {
            // First, update user status
            const user = await prisma.user.update({
              where: {
                email: customer.email as string,
              },
              data: {
                isActive: true,
              },
            });

            // If metadata contains cart items, create sales records
            if (metadata && metadata.items) {
              const items = JSON.parse(metadata.items);
              
              // Assuming you have a default store for online sales
              const defaultStore = await prisma.store.findFirst({
                where: { isActive: true }
              });

              if (!defaultStore) {
                throw new Error("Default store not found");
              }

              // Create sales records for each item
              for (const item of items) {
                await prisma.sale.create({
                  data: {
                    quantity: item.quantity,
                    totalPrice: item.price * item.quantity,
                    status: "completed",
                    customer: {
                      connect: { id: user.id }
                    },
                    product: {
                      connect: { id: item.sku }
                    },
                    store: {
                      connect: { id: "cm2qeedkl0005p0brayy8urps" }
                    }
                  }
                });
              }
            }
          } else {
            console.log(`Customer not found or does not have an email.`);
          }
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }
};