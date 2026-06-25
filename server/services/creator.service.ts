import { AppError } from "@/lib/errors/appError"
import { getPlaylistById, getPlaylistsOwnByCreator } from "../dal/prisma/playlist.dal"
import { findUserByClerkUserId, getUserById } from "../dal/prisma/user.dal"
import { getAllEnrolledUsersInCreatorPlaylist, isUserAlreadyJoinedPlaylist, joinCreatorPlaylist } from "../dal/prisma/creatorSpace.dal"
import { createUserPlaylistProgress, getAllProgressOfPlaylist } from "../dal/prisma/userPlaylistProgress.dal"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"

export async function checkPlaylistBelongToCreatorService(playlistId: string) {

    const playlist = await getPlaylistById(playlistId)

    if (!playlist) {
        throw new AppError("Playlist Not Found", 404, "PLAYLIST_NOT_FOUND")
    }

    const playlistOwner = await getUserById(playlist.userId)

    if (playlistOwner?.role !== "CREATOR") {
        throw new AppError("Playlist does not belong to creator", 400, "PLAYLIST_NOT_BELONG_TO_CREATOR")
    }

}

export async function joinCreatorPlaylistService(playlistId: string, userId: string) {

    // check user is valid or not

    const user = await getUserById(userId)

    if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND")
    }

    // check user is already join in playlist or not

    const result = await isUserAlreadyJoinedPlaylist(playlistId, userId)

    if (result) {
        throw new AppError("You are already joined in this playlist", 400, "USER_ALREADY_JOINED_PLAYLIST")
    }
    // now create a record in db

    const res = await joinCreatorPlaylist(playlistId, userId)

    if (!res) {
        throw new AppError("Failed to join creator playlist", 500, "FAILED_TO_JOIN_CREATOR_PLAYLIST")
    }

    // now create UserPlaylistProgress

    const progress = await createUserPlaylistProgress(user.id, playlistId)

    if (!progress) {
        throw new AppError("Failed to create user playlist progress", 500, "FAILED_TO_CREATE_USER_PLAYLIST_PROGRESS")
    }

}

export async function getPlaylistsOwnByCreatorService() {
    const { clerkUserId } = await requireRole(["creator"])

    if (!clerkUserId) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const playlists = await getPlaylistsOwnByCreator(user.id)

    if (!playlists) {
        return [];
    }

    return playlists;
}

export async function getJoinedUsersOfCreatorPlaylistService(playlistId: string) {
    const { clerkUserId } = await requireRole(["creator"])

    if (!clerkUserId) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    // first check this user have access to this playlist

    const playlist = await getPlaylistById(playlistId)

    if (!playlist) {
        throw new AppError("Playlist Not Found", 404, "PLAYLIST_NOT_FOUND")
    }

    if (playlist.userId !== user.id) {
        throw new AppError("You don't own this playlist", 403, "FORBIDDEN")
    }

    // now get all the enrolled users in this playlist
    const enrolledUsers = await getAllEnrolledUsersInCreatorPlaylist(playlistId);

    // now also fetch the progress of this playlist

    const progress = await getAllProgressOfPlaylist(playlistId)

    // now map progress with userid

    const mappedProgress = new Map(progress.map(p => [p.userId, p]))

    // now map enrolled user with their progress

    const enrolledUsersWithProgress = enrolledUsers.map(e => ({
        ...e,
        progress: mappedProgress.get(e.User.id) ?? null,
    }))

    return enrolledUsersWithProgress;

}