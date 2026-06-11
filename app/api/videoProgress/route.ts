import { requireRole } from '@/lib/auth/requireRole';
import { markPlaylistAsInProgress } from '@/server/dal/prisma/playlist.dal';
import { findUserByClerkUserId } from '@/server/dal/prisma/user.dal';
import { updateVideoById } from '@/server/dal/prisma/video.dal';
import {
  createVideoProgress,
  getVideoProgress,
} from '@/server/dal/prisma/videoProgress';
import { updatePlaylistByIdService } from '@/server/services/playlist.service';
import { checkVideoAndPlaylist } from '@/server/services/video.service';
import { updateVideoProgressService } from '@/server/services/videoProgress.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const videoProgressSchema = z.object({
  videoId: z.string(),
  playlistId: z.string(),
  currentTime: z.number(),
  totalDuration: z.number(),
});

// TODO: Do one more thing make sure i am checking user in db also when i am
// checking user role because what if user is deleted from db but still has valid session then also i should not allow that user to create note or video progress

export async function POST(req: NextRequest) {
  try {
    const { videoId, playlistId, currentTime, totalDuration } =
      await req.json();

    const result = videoProgressSchema.safeParse({
      videoId,
      playlistId,
      currentTime,
      totalDuration,
    });

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 },
        );
      }
    }

    // now check user is logged in and has the right role (should add this in middleware later)

    const { clerkUserId } = await requireRole(['learner']);

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    // check videoId and playlistId are valid and video belongs to playlist or not

    const { isExists } = await checkVideoAndPlaylist(videoId, playlistId);

    if (!isExists) {
      return NextResponse.json(
        { error: 'Video or playlist not found' },
        { status: 404 },
      );
    }

    // check the video progress is already been created

    const isVideoProgressExists = await getVideoProgress(
      videoId,
      user.id,
      playlistId,
    );

    if (isVideoProgressExists) {
      return NextResponse.json(
        { error: 'Video progress already exists' },
        { status: 400 },
      );
    }

    // now create video progress

    const videoProgress = await createVideoProgress({
      videoId,
      userId: user.id,
      playlistId,
      currentTime,
      totalDuration,
    });

    if (!videoProgress) {
      return NextResponse.json(
        { error: 'Failed to create video progress' },
        { status: 500 },
      );
    }

    // mark playlist as in progress if not already marked as in progress
    await markPlaylistAsInProgress(playlistId, user.id);

    return NextResponse.json(
      { message: 'Video progress created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.log('Error in creating video progress: ', error);
    return NextResponse.json(
      { error: 'Failed to create video progress' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let { currentTime, isCompleted, playlistId, videoId } = await req.json();

    // now check user is logged in and has the right role (should add this in middleware later)

    const { clerkUserId } = await requireRole(['learner']);

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    // check the video progress is already been created
    const isVideoProgressExists = await getVideoProgress(
      videoId,
      user.id,
      playlistId,
    );

    if (!isVideoProgressExists) {
      return NextResponse.json(
        {
          error: 'Video progress not found',
        },
        { status: 404 },
      );
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
          return NextResponse.json(
            {
              error: 'Failed to update video progress',
            },
            { status: 500 },
          );
        }

        // now update the video iscomplete to true and completed at to current time

        const videoUpdateResponse = await updateVideoById(
          videoId,
          playlistId,
          user.id,
          {
            isComplete: true,
            completedAt: new Date(),
          },
        );

        if (!videoUpdateResponse) {
          return NextResponse.json(
            {
              error: 'Failed to update video',
            },
            { status: 500 },
          );
        }

        // and now update the playlist completed videos count and if all videos are completed then mark playlist as completed and set completed at to current time
        await updatePlaylistByIdService(playlistId, user.id);

        return NextResponse.json(
          {
            message: 'Video marked as completed',
          },
          { status: 200 },
        );
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
      return NextResponse.json(
        {
          error: 'Failed to update video progress',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: 'Video progress updated successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error in updating video progress: ', error);
    return NextResponse.json(
      { error: 'Failed to update video progress' },
      { status: 500 },
    );
  }
}
