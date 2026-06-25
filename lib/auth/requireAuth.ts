import { auth } from '@clerk/nextjs/server';
import { AppError } from '../errors/appError';

export async function requireAuth() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  return {
    userId,
    sessionClaims,
  };
}
