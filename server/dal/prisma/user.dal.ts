import prisma from '@/lib/prisma';

export async function findUserByClerkUserId(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId,
    },
  });

  return user;
}
