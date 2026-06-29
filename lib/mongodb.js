import prisma from "./prisma";

// Backwards-compatible helper to align with previous connectMongoDB usage.
export const connectMongoDB = async () => {
  // Prisma maintains its own connection pool; simply return the client.
  return prisma;
};
