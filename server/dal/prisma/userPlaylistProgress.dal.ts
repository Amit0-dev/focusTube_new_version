import { PlaylistStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export async function createUserPlaylistProgress(
    userId: string,
    playlistId: string
) {
    return await prisma.userPlaylistProgress.create({
        data: {
            userId,
            playlistId
        }
    })
}

export async function getUserPlaylistProgress(userId: string, playlistId: string) {
    return await prisma.userPlaylistProgress.findUnique({
        where: {
            userId_playlistId: {
                userId,
                playlistId
            }
        }
    })
}

export async function markPlaylistAsInProgress(playlistId: string, userId: string) {
    return await prisma.userPlaylistProgress.update({
        where: {
            userId_playlistId: {
                userId,
                playlistId
            }
        },
        data: {
            status: PlaylistStatus.IN_PROGRESS
        }
    })
}

export async function updateUserPlaylistProgressCompletedVideoCount(
    playlistId: string,
    userId: string,
) {
    return await prisma.userPlaylistProgress.update({
        where: {
            userId_playlistId: {
                userId,
                playlistId
            }
        },
        data: {
            completedVideosCount: {
                increment: 1,
            }
        }
    })
}

export async function updateUserPlaylistProgressStatusCompletedById(playlistId: string, userId: string) {
    return await prisma.userPlaylistProgress.update({
        where: {
            userId_playlistId: {
                userId,
                playlistId
            }
        },
        data: {
            status: PlaylistStatus.COMPLETED,
            completedAt: new Date()
        }
    })
}

export async function getAllPlaylists(userId: string) {
    return await prisma.userPlaylistProgress.findMany({
        where: {
            userId
        },
        select: {
            completedVideosCount: true,
            status: true,
            completedAt: true,
            Playlist: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function getAllProgressOfPlaylist(playlistId: string) {
    return await prisma.userPlaylistProgress.findMany({
        where: {
            playlistId
        }
    })
}