
import CreatorDashboard from '@/components/creator-dashboard/Dashboard';
import CreatorPlaylist from '@/components/creator-dashboard/Playlist';

export default async function CreatorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queries = await searchParams;
  const tab = queries?.tab ?? 'playlists';

  if (tab === 'dashboard') return <CreatorDashboard />;
  if (tab === 'playlists') return <CreatorPlaylist />;

  return <CreatorPlaylist />;
}
