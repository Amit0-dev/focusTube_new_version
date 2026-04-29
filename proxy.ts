import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/signin(.*)',
  '/signup(.*)',
  '/',
  '/setup(.*)',
  '/api/webhooks/clerk(.*)',
]);

const getDashboardRoute = (role: string) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'creator') return '/creator/dashboard';
  return '/learner/dashboard';
};

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  console.log('============HIT MIDDLEWARE=================');
  console.log({
    isAuthenticated,
    metadata: sessionClaims?.metadata,
    url: req.url,
    pathname,
    rsc: req.headers.get('rsc'),
  });

  if (!isPublicRoute(req) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const role = sessionClaims?.metadata?.role?.toLowerCase();

  console.log('User Role (Inside middleware):', role);

  // when role is not set, redirect to setup page (wait for role to be set in session metadata, then redirect to dashboard based on role)
  if (!role && isAuthenticated) {
    if (!pathname.startsWith('/setup')) {
      return NextResponse.redirect(new URL('/setup', req.url));
    }
    return NextResponse.next();
  }

  // redirect to dashboards

  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL(getDashboardRoute(role!), req.url));
  }

  // Protected routes access control based on role

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(getDashboardRoute(role!), req.url));
  }

  if (pathname.startsWith('/creator') && role !== 'creator') {
    return NextResponse.redirect(new URL(getDashboardRoute(role!), req.url));
  }

  if (pathname.startsWith('/learner') && role !== 'learner') {
    return NextResponse.redirect(new URL(getDashboardRoute(role!), req.url));
  }

  // prevent authenticated users from accessing signin/signup pages

  if (
    isAuthenticated &&
    (pathname === '/signin' || pathname.startsWith('/signup'))
  ) {
    return NextResponse.redirect(new URL(getDashboardRoute(role!), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
