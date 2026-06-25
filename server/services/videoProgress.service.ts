import { updateVideoProgress } from '../dal/prisma/videoProgress';
import { getPlaylistById } from '../dal/prisma/playlist.dal';
import { getVideoByIdAndPlaylist } from '../dal/prisma/video.dal';
import { AppError } from '@/lib/errors/appError';
import { getUserPlaylistProgress } from '../dal/prisma/userPlaylistProgress.dal';

export async function updateVideoProgressService({
  currentTime,
  isComplete,
  id,
  userId,
}: {
  currentTime: number;
  isComplete: boolean;
  id: string;
  userId: string;
}) {

  let completedAt: Date | null = null;

  if (isComplete) {
    completedAt = new Date();
  }

  const result = await updateVideoProgress({
    currentTime,
    isComplete,
    id,
    userId,
    completedAt,
  });

  if (!result) {
    throw new AppError("Failed to update video progress", 500, "FAILED_TO_UPDATE_VIDEO_PROGRESS")
  }

  return result;

}

export async function checkVideoAndPlaylist(
  videoId: string,
  playlistId: string,
  userId: string
) {


  const playlist = await getPlaylistById(playlistId);
  if (!playlist) throw new AppError('Playlist not found', 404, "PLAYLIST_NOT_FOUND");

  const video = await getVideoByIdAndPlaylist(videoId, playlistId);

  if (!video) throw new AppError("Video not found or video does not belongs to the playlist", 404, "VIDEO_NOT_FOUND_OR_NOT_BELONGS_TO_PLAYLIST");

  // Is this user authorized? ← THE KEY CHECK
  const progress = await getUserPlaylistProgress(userId, playlist.id);

  if (!progress) throw new AppError("You are not authorized to access this playlist", 403, "UNAUTHORIZED");

  return { playlist, video }

}