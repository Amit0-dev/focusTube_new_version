'use client';

import { useAuth } from '@clerk/nextjs';
import { Button } from '@heroui/react';
import { Spotlight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <div className="w-full h-16 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl
                bg-orange-400/20 text-orange-400"
        >
          <Spotlight size={18} />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white">
          Focus<span className="italic text-orange-400">Tube</span>
        </h3>
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        <Button
          variant="primary"
          className={'py-2 px-5 bg-orange-400 text-white font-bold'}
          onClick={() => router.push('/signin')}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
