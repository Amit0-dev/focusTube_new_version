import { requireAuth } from '@/lib/auth/requireAuth';

import { getPlaylistById } from '../dal/prisma/playlist.dal';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';
import {
  getAllVideosByPlaylistId,
  getVideoById,
} from '../dal/prisma/video.dal';

export async function getVideosByPlaylistIdService(playlistId: string) {
  try {
    // TODO: Rethink once either role checking is necessary for this service or not.
    // TODO: add better error handling and logging here
    // TODO: add pagination
    const { userId: clerkUserId } = await requireAuth();

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const videos = await getAllVideosByPlaylistId(playlistId);
    return videos;
  } catch (error) {
    console.error('Error in getVideosByPlaylistIdService - ', error);
    throw new Error('Failed to fetch videos for the playlist');
  }
}

export async function checkVideoAndPlaylist(
  videoId: string,
  playlistId: string,
) {
  try {
    const { userId: clerkUserId } = await requireAuth();

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const isPlaylistExists = await getPlaylistById(playlistId, user.id);

    if (!isPlaylistExists) {
      throw new Error('Playlist not found');
    }

    const isVideoExists = await getVideoById(videoId, playlistId, user.id);

    if (!isVideoExists) {
      throw new Error('Video not found');
    }

    return {
      isPlaylistExists,
      isVideoExists,
      isExists: true,
    };
  } catch (error) {
    console.error('Error in checkVideoAndPlaylist - ', error);
    throw new Error('Failed to check video and playlist');
  }
}
