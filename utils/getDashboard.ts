export const getDashboardRoute = (role: string) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'creator') return '/creator?tab=playlists';
  return '/learner/?tab=playlists';
};