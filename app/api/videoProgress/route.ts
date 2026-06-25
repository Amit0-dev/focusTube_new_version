import { requireAuth } from '@/lib/auth/requireAuth';
import { AppError } from '@/lib/errors/appError';
import { getUserPlaylistProgress, markPlaylistAsInProgress } from '@/server/dal/prisma/userPlaylistProgress.dal';
import { findUserByClerkUserId } from '@/server/dal/prisma/user.dal';
import { getVideoByIdAndPlaylist } from '@/server/dal/prisma/video.dal';
import {
  createVideoProgress,
  getVideoProgress,
} from '@/server/dal/prisma/videoProgress';
import { updateUserPlaylistProgress } from '@/server/services/userPlaylistProgress.service';
import { checkVideoAndPlaylist } from '@/server/services/videoProgress.service';
import { updateVideoProgressService } from '@/server/services/videoProgress.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleApiError } from '@/lib/api/handleApiError';
import { getPlaylistById } from '@/server/dal/prisma/playlist.dal';

const createVideoProgressSchema = z.object({
  videoId: z.string(),
  playlistId: z.string(),
  currentTime: z.number(),
  totalDuration: z.number(),
});

const updateVideoProgressSchema = z.object({
  currentTime: z.number(),
  isCompleted: z.boolean(),
  playlistId: z.string(),
  videoId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { videoId, playlistId, currentTime, totalDuration } =
      await req.json();

    const result = createVideoProgressSchema.safeParse({
      videoId,
      playlistId,
      currentTime,
      totalDuration,
    });

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        throw new AppError(result.error.message, 400, 'INVALID_CREATE_VIDEO_PROGRESS_DATA')
      }
    }

    const { userId: clerkUserId } = await requireAuth()

    if (!clerkUserId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    // check the video progress is already been created

    const isVideoProgressExists = await getVideoProgress(
      videoId,
      user.id,
      playlistId,
    );

    if (isVideoProgressExists) {
      throw new AppError("Video progress already exists", 400, "VIDEO_PROGRESS_ALREADY_EXISTS");
    }

    // check videoId and playlistId are valid and video belongs to playlist or not

    const { playlist, video } = await checkVideoAndPlaylist(videoId, playlistId, user.id);

    // now create video progress

    const videoProgress = await createVideoProgress({
      videoId: video.id,
      userId: user.id,
      playlistId: playlist.id,
      currentTime,
      totalDuration,
    });

    if (!videoProgress) {
      throw new AppError("Failed to create video progress", 500, "FAILED_TO_CREATE_VIDEO_PROGRESS")
    }

    // mark playlist as in progress if not already marked as in progress -> (UserPlaylistProgress)
    await markPlaylistAsInProgress(playlist.id, user.id);

    return NextResponse.json(
      { message: 'Video progress created successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let { currentTime, isCompleted, playlistId, videoId } = await req.json();

    const result = updateVideoProgressSchema.safeParse({ currentTime, isCompleted, playlistId, videoId })

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        throw new AppError(result.error.message, 400, 'INVALID_UPDATE_VIDEO_PROGRESS_DATA')
      }
    }

    const { userId: clerkUserId } = await requireAuth()

    if (!clerkUserId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    // check playlist and video id is valid and exists.

    const playlist = await getPlaylistById(playlistId)
    if (!playlist) throw new AppError("Playlist not found", 404, "PLAYLIST_NOT_FOUND")

    // check if video is exists in the playlist

    const video = await getVideoByIdAndPlaylist(videoId, playlistId);
    if (!video) throw new AppError("Video not found in playlist", 404, "VIDEO_NOT_FOUND_IN_PLAYLIST")

    // Is this user authorized? ← THE KEY CHECK
    const progress = await getUserPlaylistProgress(user.id, playlist.id);

    if (!progress) throw new AppError("You are not authorized to access this playlist", 403, "UNAUTHORIZED");

    // check the video progress is already been created
    const isVideoProgressExists = await getVideoProgress(
      videoId,
      user.id,
      playlistId,
    );

    if (!isVideoProgressExists) {
      throw new AppError("Video progress not found", 404, "VIDEO_PROGRESS_NOT_FOUND")
    }

    // check either this video is already marked as completed or not

    const isAlreadyCompleted = isVideoProgressExists.isComplete;

    if (isAlreadyCompleted) {
      return NextResponse.json(
        {
          message: 'Video is already marked as completed',
        },
        { status: 200 },
      );
    }

    // check either video is complete or not

    if (isCompleted) {
      const shouldItMarkCompleted =
        !isVideoProgressExists.isComplete &&
        currentTime >= isVideoProgressExists.totalDuration * 0.9;

      if (shouldItMarkCompleted) {
        isCompleted = true;

        const response = await updateVideoProgressService({
          currentTime,
          isComplete: isCompleted,
          id: isVideoProgressExists.id,
          userId: user.id,
        });

        if (!response) {
          throw new AppError("Failed to update video progress", 500, "FAILED_TO_UPDATE_VIDEO_PROGRESS")
        }


        await updateUserPlaylistProgress(playlist.id, user.id, playlist.itemCount);
      }
    }
    // TODO: somebody can send request to this api to update the last play time and total duration without watching the video, need to handle this case as well (figure out the solution for this case)

    // now update the video progress with current time and completion status

    const updatedVideoProgress = await updateVideoProgressService({
      currentTime,
      isComplete: isCompleted,
      id: isVideoProgressExists.id,
      userId: user.id,
    });

    if (!updatedVideoProgress) {
      throw new AppError("Failed to update video progress", 500, "FAILED_TO_UPDATE_VIDEO_PROGRESS")
    }

    return NextResponse.json(
      { message: 'Video progress updated successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error)
  }
}
