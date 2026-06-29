import prisma from '@/lib/prisma';

export async function connectToDatabase() {
  return prisma;
}
