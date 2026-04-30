'use client';

import Container from '@/components/common/Container';
import { getDashboardRoute } from '@/utils/getDashboard';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Setup = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const role = user?.publicMetadata?.role as string | undefined;
  console.log('User Role (Inside Setup page):', role);

  const pathname = usePathname();

  // TODO: Understand this logic (later) and optimize if possible
  useEffect(() => {
    if (!isLoaded) return;

    // 🔁 Poll until role exists
    if (!role) {
      const interval = setInterval(() => {
        user?.reload();
      }, 1000);

      return () => clearInterval(interval); // ✅ cleanup
    }

    const target = getDashboardRoute(role);

    // 🚫 prevent same-route redirect loop
    if (pathname === target) return;

    router.replace(target);
  }, [role, isLoaded, router, pathname, user]);

  return (
    <Container className="w-full h-screen flex items-center justify-center">
      <h4 className="font-medium text-sm">Setting up your account...</h4>
    </Container>
  );
};

export default Setup;
