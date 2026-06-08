import { requireAuth } from '@/lib/auth/requireAuth';

import { getAllPlaylists, getPlaylistById } from '../dal/prisma/playlist.dal';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';

export async function getPlaylistOfCurrentUserService() {
  try {
    // TODO: add pagination and filtering
    const { userId: clerkUserId } = await requireAuth();

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const playlists = await getAllPlaylists(user.id);

    return playlists;
  } catch (error) {
    console.error('Error in getPlaylistOfCurrentUserService - ', error);
    throw new Error('Failed to fetch playlists');
  }
}

export async function getPlaylistByIdService(playlistId: string) {
  try {
    const { userId: clerkUserId } = await requireAuth();

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const playlist = await getPlaylistById(playlistId);

    return playlist;
  } catch (error) {
    console.error('Error in getPlaylistByIdService - ', error);
    throw new Error('Failed to fetch playlist');
  }
}
