'use client';

import Container from '@/components/common/Container';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Setup = () => {
  const { user } = useUser();
  const router = useRouter();

  const role = user?.publicMetadata?.role;

  useEffect(() => {
    if (role === 'admin') router.push('/admin');
    else if (role === 'creator') router.push('/creator');
    else if (role === 'learner') router.push('/learner');
  }, [role]);

  return (
    <Container className="w-full h-screen flex items-center justify-center">
      <h4 className="font-medium text-sm">Setting up your account...</h4>
    </Container>
  );
};

export default Setup;
