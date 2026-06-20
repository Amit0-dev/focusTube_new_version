import PlaylistDetailContent from '@/components/creator-playlist/PlaylistDetailContent';

export default async function CreatorPlaylistPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queries = await searchParams;
  const tab = (queries?.tab as string) ?? 'videos';

  return <PlaylistDetailContent tab={tab} />;
}
