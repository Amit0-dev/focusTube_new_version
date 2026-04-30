import { Show, UserButton } from '@clerk/nextjs';
import { Spotlight } from 'lucide-react';

import DashboardRedirectButton from './DashboardRedirectButton';
import Login from './Login';
import Container from './common/Container';


export function Header() {
  return (
    <Container>
      <header className="w-full h-16 py-4 flex items-center justify-between">
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
        <Show when="signed-in">
          <div className="flex items-center justify-center gap-6">
            <DashboardRedirectButton />

            <UserButton />
          </div>
        </Show>
        <Show when="signed-out">
          <Login />
        </Show>
      </header>
    </Container>
  );
}
