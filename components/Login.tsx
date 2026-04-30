'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      className={'py-2 px-5 bg-orange-400 text-white font-bold'}
      onClick={() => router.push('/signin')}
    >
      Sign In
    </Button>
  );
};

export default Login;
