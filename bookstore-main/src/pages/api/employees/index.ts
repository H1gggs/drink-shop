
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "../../../../lib/prisma"; // Import your Prisma client instance

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }


  switch (req.method) {
    case "GET":
      try {
        const employees = await prisma.user.findMany();
        res.status(200).json({ employees });
      } catch (error) {
        res.status(500).json({ error: "Error fetching employees." });
      }
      break;

    case "POST":
      try {
        const { firstName, lastName, username, email, address, phoneNumber,password } = req.body;

        console.log(req, "req")
        // Validation can be added here

        const newEmployee = await prisma.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            address,
            password
          },
        });

        res.status(201).json({ employee: newEmployee });
      } catch (error) {
        res.status(500).json({ error: "Error creating employee." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}