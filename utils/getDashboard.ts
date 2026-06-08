export const getDashboardRoute = (role: string) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'creator') return '/creator/dashboard';
  return '/learner/?tab=playlists';
};