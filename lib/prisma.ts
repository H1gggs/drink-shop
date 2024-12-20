import { PrismaClient } from '.prisma/client';

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: logs all queries being run
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}