import { requireAuth } from './requireAuth';

export async function requireRole(allowedRoles: string[]) {
  const { userId, sessionClaims } = await requireAuth();

  const userRole = sessionClaims?.metadata?.role?.toString().toLowerCase();

  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new Error('Forbidden');
  }

  return {
    clerkUserId: userId,
    userRole,
  };
}
