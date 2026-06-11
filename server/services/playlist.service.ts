import { requireAuth } from '@/lib/auth/requireAuth';
import { playlistStatusMap } from '@/utils/role';

import {
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistCompletedVideosCountById,
  updatePlaylistStatusById,
} from '../dal/prisma/playlist.dal';
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

    const playlist = await getPlaylistById(playlistId, user.id);

    return playlist;
  } catch (error) {
    console.error('Error in getPlaylistByIdService - ', error);
    throw new Error('Failed to fetch playlist');
  }
}

export async function updatePlaylistByIdService(
  playlistId: string,
  userId: string,
) {
  try {
    // first get the playlist
    const playlist = await getPlaylistById(playlistId, userId);

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // increment the completed videos count
    const updatedPlaylist = await updatePlaylistCompletedVideosCountById(
      playlistId,
      userId,
    );

    if (!updatedPlaylist) {
      throw new Error('Failed to update playlist');
    }

    const { itemCount, completedVideosCount } = updatedPlaylist;

    // if all videos are completed then mark the playlist as completed

    if (completedVideosCount === itemCount) {
      await updatePlaylistStatusById(
        playlistId,
        userId,
        playlistStatusMap.completed,
        new Date(),
      );
    }
  } catch (error) {
    console.error('Error in updatePlaylistByIdService - ', error);
    throw new Error('Failed to update playlist');
  }
}
