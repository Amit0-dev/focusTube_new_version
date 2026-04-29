'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@heroui/react';

const Logout = () => {
  const { signOut } = useClerk();
  return (
    <Button
      className={'py-2 px-5 bg-orange-400 text-white font-bold'}
      variant="primary"
      onClick={() => signOut({ redirectUrl: '/signin' })}
    >
      Logout
    </Button>
  );
};

export default Logout;
