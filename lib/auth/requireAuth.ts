import { auth } from '@clerk/nextjs/server';

export async function requireAuth() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return {
    userId,
    sessionClaims,
  };
}
