export async function deletePlaylist(playlistId: string) {
  const response = await fetch('/api/playlist', {
    method: 'DELETE',
    body: JSON.stringify({ playlistId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete playlist');
  }

  const data = await response.json();
  console.log('Deleted playlist:', data);

  return data.message;
}
