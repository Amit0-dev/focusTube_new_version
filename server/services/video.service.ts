import { requireAuth } from '@/lib/auth/requireAuth';

import { findUserByClerkUserId } from '../dal/prisma/user.dal';
import { getAllVideosByPlaylistId } from '../dal/prisma/video.dal';

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
