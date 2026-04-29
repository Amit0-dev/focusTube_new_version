import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isValidRole } from './utils/isValidRole';

const isPublicRoute = createRouteMatcher([
  '/signin(.*)',
  '/signup(.*)',
  '/',
  '/api/webhooks/clerk(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, userId } = await auth();

  console.log('User ID:', userId);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Request URL:', req.url);

  if (!isPublicRoute(req) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (userId) {
    try {
      const client = await clerkClient();

      const user = await client.users.getUser(userId);

      console.log('User Object:', user);

      // Not sure it is correct or not
      const rawRole = user.publicMetadata.role;

      const role = isValidRole(rawRole) ? rawRole : undefined;

      console.log('User Role:', role);

      // admin redirect to admin dashboard

      if (
        role?.toLowerCase() === 'admin' &&
        req.nextUrl.pathname === '/dashboard'
      ) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      // prevent non admin user to access admin dashboard

      if (
        role?.toLowerCase() !== 'admin' &&
        req.nextUrl.pathname === '/admin/dashboard'
      ) {
        return NextResponse.redirect(
          new URL(
            role?.toLowerCase() === 'creator'
              ? '/creator/dashboard'
              : '/learner/dashboard',
            req.url,
          ),
        );
      }

      // redirect auth user trying to access public route

      if (isPublicRoute(req)) {
        return NextResponse.redirect(
          new URL(
            role?.toLowerCase() === 'admin'
              ? '/admin/dashboard'
              : role?.toLowerCase() === 'creator'
                ? '/creator/dashboard'
                : '/learner/dashboard',
            req.url,
          ),
        );
      }
    } catch (error) {}
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
