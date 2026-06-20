import PlaylistDetailContent from '@/components/creator-playlist/PlaylistDetailContent';

export default async function CreatorPlaylistPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ playlistId: string }>
}) {
  const queries = await searchParams;
  const { playlistId } = await params;
  const tab = (queries?.tab as string) ?? 'videos';

  return <PlaylistDetailContent tab={tab} playlistId={playlistId} />;
}
