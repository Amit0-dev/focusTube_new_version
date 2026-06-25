import { requireAuth } from '@/lib/auth/requireAuth';
import {
  getAllCreatorPlaylists,
  getPlaylistById,
} from '../dal/prisma/playlist.dal';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';
import { AppError } from '@/lib/errors/appError';
import { getAllPlaylists, getUserPlaylistProgress } from '../dal/prisma/userPlaylistProgress.dal';

export async function getPlaylistOfCurrentUserService() {
  try {
    // TODO: add pagination and filtering
    const { userId: clerkUserId } = await requireAuth()

    if (!clerkUserId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const playlists = await getAllPlaylists(user.id);

    return playlists;
  } catch (error) {
    throw new AppError("Failed to fetch playlists", 500, "FAILED_TO_FETCH_PLAYLISTS");
  }
}

export async function getPlaylistByIdService(playlistId: string) {
  const { userId: clerkUserId } = await requireAuth()

  if (!clerkUserId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const user = await findUserByClerkUserId(clerkUserId);

  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const playlist = await getPlaylistById(playlistId);
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

  return playlist;
}

//TODO: Add a publish status to playlist model only show that playlist which is published: true
export async function getAllCreatorPlaylistsService() {

  const { userId: clerkUserId } = await requireAuth()

  if (!clerkUserId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const user = await findUserByClerkUserId(clerkUserId);

  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const creatorPlaylist = await getAllCreatorPlaylists(user.id)

  if (!creatorPlaylist) {
    throw new AppError("Creator playlists not found", 404, "CREATOR_PLAYLISTS_NOT_FOUND")
  }

  return creatorPlaylist
}