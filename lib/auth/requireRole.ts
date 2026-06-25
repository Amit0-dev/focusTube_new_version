import { AppError } from '../errors/appError';
import { requireAuth } from './requireAuth';

export async function requireRole(allowedRoles: string[]) {
  const { userId, sessionClaims } = await requireAuth();

  const userRole = sessionClaims?.metadata?.role?.toString().toLowerCase();

  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new AppError("You are not authorized to perform this action", 403, "FORBIDDEN")
  }

  return {
    clerkUserId: userId,
    userRole,
  };
}
