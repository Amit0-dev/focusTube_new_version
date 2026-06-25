import { AppError } from '@/lib/errors/appError';
import { fetchPlaylist, fetchPlaylistVideos } from '../api/youtube.api';
import {
  createPlaylist,
  findPlaylistByYoutubePlaylistId,
} from '../dal/prisma/playlist.dal';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';
import { createUserPlaylistProgress } from '../dal/prisma/userPlaylistProgress.dal';

export async function importPlaylistService(args: {
  clerkUserId: string;
  playlistId: string;
}) {
  // first check user is valid or not

  const user = await findUserByClerkUserId(args.clerkUserId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND")
  }

  // check wheather playlist exists with this playlistId in db

  const existingPlaylist = await findPlaylistByYoutubePlaylistId(
    args.playlistId,
    user.id
  );

  if (existingPlaylist) {
    throw new AppError("Playlist already exists", 409, "PLAYLIST_ALREADY_EXISTS")
  }

  // now fetch the playlist through yt apis

  const playlistResponse = await fetchPlaylist({ playlistId: args.playlistId });

  if (!playlistResponse) {
    throw new AppError("Invalid playlist response", 400, "INVALID_PLAYLIST_RESPONSE")
  }

  const playlistItem = playlistResponse[0];

  // now fetch the videos

  const videos = await fetchPlaylistVideos({ playlistId: args.playlistId });

  // now call dal to save data into db

  try {
    const createdPlaylist = await createPlaylist(
      {
        youtubePlaylistId: playlistItem.id,
        userId: user.id,
        kind: playlistItem.kind,
        title: playlistItem.snippet.title,
        description: playlistItem.snippet.description,
        channelId: playlistItem.snippet.channelId,
        publishedAt: new Date(playlistItem.snippet.publishedAt),
        thumbnail: playlistItem.snippet.thumbnails.standard.url || '',
        channelTitle: playlistItem.snippet.channelTitle,
        itemCount: playlistItem.contentDetails.itemCount,
      },
      videos.map((video) => ({
        youtubeVideoId: video.youtubeVideoId,
        channelId: video.channelId,
        title: video.title,
        description: video.description,
        publishedAt: new Date(video.publishedAt),
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        position: video.position,
        kind: video.kind,
      })),
    );

    if (!createdPlaylist) {
      throw new AppError("Failed to import playlist", 500, "FAILED_TO_IMPORT_PLAYLIST")
    }

    // now create UserPlaylistProgress for only learner

    if (user.role === "LEARNER") {
      await createUserPlaylistProgress(user.id, createdPlaylist.id)
    }

    return {
      createdPlaylist
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to import playlist", 500, "FAILED_TO_IMPORT_PLAYLIST")
  }
}
