import { AppError } from "@/lib/errors/appError";
import { updateUserPlaylistProgressCompletedVideoCount, updateUserPlaylistProgressStatusCompletedById } from "../dal/prisma/userPlaylistProgress.dal";

export async function updateUserPlaylistProgress(
    playlistId: string,
    userId: string,
    playlistItemContent: number
) {

    // increment the completed videos count
    const updatedPlaylist = await updateUserPlaylistProgressCompletedVideoCount(
        playlistId,
        userId,
    );

    if (!updatedPlaylist) {
        throw new AppError("Failed to update user playlist progress", 500, "FAILED_TO_UPDATE_USER_PLAYLIST_PROGRESS")
    }

    // if all videos are completed then mark the playlist as completed

    if (updatedPlaylist.completedVideosCount === playlistItemContent) {
        const response = await updateUserPlaylistProgressStatusCompletedById(
            playlistId,
            userId
        );

        if (!response) {
            throw new AppError("Failed to mark playlist as completed", 500, "FAILED_TO_MARK_PLAYLIST_AS_COMPLETED")
        }
    }

}