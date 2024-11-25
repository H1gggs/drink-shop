import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma";
import Stripe from "stripe";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from ".prisma/client";

interface CustomUser extends User {
  user: {
    id: number;
    name: string | null;
    email: string | null;
    stripeCustomerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    isActive: boolean;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let userCredentials = {};
        if (credentials) {
          userCredentials = {
            email: credentials.email,
            password: credentials.password,
          };
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/auth`,
          {
            method: "POST",
            body: JSON.stringify(userCredentials),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
  // events: {
  //   createUser: async ({ user }) => {
  //     try {
  //       const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  //         apiVersion: "2023-08-16",
  //       });

  //       // Create a stripe customer for the user with their email address
  //       const customer = await stripe.customers.create({
  //         email: user.email!,
  //       });

  //       // Use the Prisma Client to update the user in the database with their new Stripe customer ID
  //       await prisma.user.update({
  //         where: { id: user.id },
  //         data: {
  //           stripeCustomerId: customer.id,
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Error in createUser event:", error);
  //       // Handle the error appropriately, e.g., throw or log it.
  //     }
  //   },
  // },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn(params) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
          apiVersion: "2023-08-16",
        });

        const customer = await stripe.customers.create({
          email: params.user.email!,
        });

        
      } catch (error) {
        console.error("Error in createUser event:", error);
      }

      return Promise.resolve(true);
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);
