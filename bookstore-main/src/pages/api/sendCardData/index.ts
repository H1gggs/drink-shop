// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "../../../../lib/prisma";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       const { items, userId } = req.body;

//       const createdSales = [];

//       for (const item of items) {
//         // Calculate total price for this item
//         const totalPrice = item.price * item.quantity;

//         // Create sale record
//         const createdSale = await prisma.sale.create({
//           data: {
//             quantity: item.quantity,
//             totalPrice,
//             status: "completed",
//             customer: {
//               connect: { id: userId },
//             },
//             product: {
//               connect: { id: item.id },
//             },
//             store: {
//               connect: { id: "cm2qeedkl0005p0brayy8urps" },
//             },
//           },
//           include: {
//             customer: true,
//             product: true,
//             store: true,
//           },
//         });

//         createdSales.push(createdSale);
//       }

//       res.status(200).json({
//         message: "Sales data saved successfully",
//         sales: createdSales,
//       });
//     } catch (error) {
//       console.error("Error saving sales data:", error);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
