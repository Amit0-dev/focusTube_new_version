import CreatorPlaylists from '@/components/learner-dashboard/CreatorPlaylists';
import Dashboard from '@/components/learner-dashboard/Dashboard';
import Note from '@/components/learner-dashboard/Note';
import Playlist from '@/components/learner-dashboard/Playlist';

export default async function LearnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queries = await searchParams;
  const tab = queries?.tab ?? 'playlists';

  if (tab === 'dashboard') return <Dashboard />;
  if (tab === 'playlists') return <Playlist />;
  if (tab === 'creator-playlists') return <CreatorPlaylists />;

  if (tab === 'notes')
    return (
      <Note
        title="Notes"
        subtitle="Capture key takeaways while you learn."
        items={[
          'React State Patterns',
          'CSS Layout Checklist',
          'API Auth Notes',
          'Deployment Checklist',
        ]}
      />
    );

  return <Playlist />;
}
