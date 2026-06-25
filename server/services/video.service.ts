import { requireAuth } from '@/lib/auth/requireAuth';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';
import { getAllVideosByPlaylistId } from '../dal/prisma/video.dal';
import { AppError } from '@/lib/errors/appError';
import { getPlaylistById } from '../dal/prisma/playlist.dal';
import { getUserPlaylistProgress } from '../dal/prisma/userPlaylistProgress.dal';

export async function getVideosByPlaylistIdService(playlistId: string) {
  // TODO: add pagination
  const { userId: clerkUserId } = await requireAuth()

  if (!clerkUserId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const user = await findUserByClerkUserId(clerkUserId);

  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  // check playlist exists for not
  const playlist = await getPlaylistById(playlistId)
  if (!playlist) {
    throw new AppError("Playlist not found", 404, "PLAYLIST_NOT_FOUND")
  }

  // check current user have ownership of this playlist
  // 1. Creator owns it directly
  // 2. Learner has joined it (has progress)

  const isOwner = playlist.userId === user.id;

  if (!isOwner) {
    const progress = await getUserPlaylistProgress(user.id, playlist.id)

    if (!progress) {
      throw new AppError("You don't have access to this playlist", 403, "ACCESS_DENIED")
    }
  }

  const videos = await getAllVideosByPlaylistId(playlist.id);
  return videos;

}


