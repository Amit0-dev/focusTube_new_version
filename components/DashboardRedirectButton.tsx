'use client';

import { getDashboardRoute } from '@/utils/getDashboard';
import { useUser } from '@clerk/nextjs';
import { Button } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';

// BUG: fix the bug in this component when i am going for signup then it throws error says user role is not defined in public metadata.
const DashboardRedirectButton = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const role = user.publicMetadata.role as string;

  if (!role) {
    throw new Error('User role is not defined in public metadata');
  }

  const dashboardRoute = getDashboardRoute(role);

  return (
    <>
      {pathname.includes('dashboard') ? null : (
        <Button
          variant="primary"
          className={'py-2 px-5 bg-orange-400 text-white font-bold'}
          onClick={() => router.push(dashboardRoute)}
        >
          Dashboard
        </Button>
      )}
    </>
  );
};

export default DashboardRedirectButton;
