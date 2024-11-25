// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "../../../../lib/prisma"; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await prisma.$connect();
    const products = await prisma.product.findMany();

    res.status(200).json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}