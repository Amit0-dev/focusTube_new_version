import prisma from "@/lib/prisma";

export async function isUserAlreadyJoinedPlaylist(playlistId: string, userId: string) {
    return await prisma.creatorSpace.findUnique({
        where: {
            userId_playlistId: {
                userId,
                playlistId
            }
        }
    })
}

export async function joinCreatorPlaylist(playlistId: string, userId: string) {
    return await prisma.creatorSpace.create({
        data: {
            userId,
            playlistId
        }
    })
}