
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

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const emp = await prisma.user.findUnique({
          where: { id: Number(id) },
        });
        if (emp) {
          res.status(200).json({ employee: emp });
        } else {
          res.status(404).json({ message: "Employee not found." });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching employee." });
      }
      break;

    case "PUT":
      try {
        const { firstName, lastName, username ,email, phoneNumber,  } = req.body;

        // Validation can be added here

        const updatedEmployee = await prisma.user.update({
          where: { id: Number(id) },
          data: { firstName, lastName, username, email, phoneNumber },
        });

        res.status(200).json({ employee: updatedEmployee });
      } catch (error) {
        res.status(500).json({ error: "Error updating employee." });
      }
      break;

    case "DELETE":
      try {
        await prisma.user.delete({
          where: { id: Number(id) },
        });

        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: "Error deleting employee." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}