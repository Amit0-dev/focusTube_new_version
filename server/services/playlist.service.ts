import { requireAuth } from '@/lib/auth/requireAuth';
import { playlistStatusMap } from '@/utils/role';

import {
  getAllCreatorPlaylists,
  getAllPlaylists,
  getPlaylistById,
  getPlaylistByIdForJoin,
  getUserEnrolledCreatorPlaylist,
  isUserAlreadyJoinedPlaylist,
  joinCreatorPlaylist,
  updatePlaylistCompletedVideosCountById,
  updatePlaylistStatusById,
} from '../dal/prisma/playlist.dal';
import { findUserByClerkUserId, getUserById } from '../dal/prisma/user.dal';

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

export async function checkPlaylistBelongToCreatorService(playlistId: string) {
  try {

    const playlist = await getPlaylistByIdForJoin(playlistId)

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const playlistOwnerId = playlist.userId

    const playlistOwner = await getUserById(playlistOwnerId)

    if (playlistOwner?.role !== "CREATOR") {
      throw new Error('Playlist does not belong to creator')
    }

    return {
      playlist,
      playlistOwner,
      isPlaylistBelongToCreator: true
    }

  } catch (error) {
    console.error('Error in checkPlaylistBelongToCreator - ', error);
    throw new Error('Failed to check playlist');
  }
}

export async function joinCreatorPlaylistService(playlistId: string, userId: string) {
  try {

    // check user is valid or not

    const user = await getUserById(userId)

    if (!user) {
      throw new Error("User not found")
    }

    // check user is already join in playlist or not

    const result = await isUserAlreadyJoinedPlaylist(playlistId, userId)

    if (result) {
      throw new Error("User is already joined in playlist")
    }
    // now create a record in db

    const res = await joinCreatorPlaylist(playlistId, userId)

    if (!res) {
      throw new Error("Failed to join creator playlist")
    }

    return res

  } catch (error) {
    console.error('Error in joinCreatorPlaylist - ', error);
    throw new Error('Failed to join creator playlist');
  }
}

export async function getAllCreatorPlaylistsService() {
  try {

    const { userId: clerkUserId } = await requireAuth();

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const creatorPlaylist = await getAllCreatorPlaylists()

    if (!creatorPlaylist) {
      throw new Error('Creator playlist not found');
    }

    return creatorPlaylist


  } catch (error) {
    console.error('Error in getAllCreatorPlaylists - ', error);
    throw new Error('Failed to fetch creator playlists');
  }
}

export async function getUserEnrolledCreatorPlaylistService() {
  try {

    const { userId: clerkUserId } = await requireAuth();

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const enrolledPlaylists = await getUserEnrolledCreatorPlaylist(user.id);

    if (!enrolledPlaylists) {
      throw new Error('Enrolled playlists not found');
    }

    return enrolledPlaylists

  } catch (error) {
    console.error('Error in getUserEnrolledCreatorPlaylistService - ', error);
    throw new Error('Failed to fetch enrolled creator playlists');
  }
}