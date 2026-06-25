import { handleApiError } from '@/lib/api/handleApiError';
import { requireAuth } from '@/lib/auth/requireAuth';
import { AppError } from '@/lib/errors/appError';
import { getNotes } from '@/server/dal/prisma/note.dal';
import { findUserByClerkUserId } from '@/server/dal/prisma/user.dal';
import { createNoteService } from '@/server/services/note.service';
import { checkVideoAndPlaylist } from '@/server/services/videoProgress.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createNoteSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  timestamp: z.number().nonnegative('Timestamp must be a non-negative number'),
  playlistId: z.string(),
  videoId: z.string(),
});

const getNotesSchema = z.object({
  playlistId: z.string(),
  videoId: z.string(),
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { content, timestamp, playlistId, videoId } = await req.json();

    const result = createNoteSchema.safeParse({ content, timestamp, playlistId, videoId });

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        throw new AppError(result.error.message, 400, 'INVALID_CREATE_NOTE_INPUT');
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

    // check videoId and playlistId are valid and video belongs to playlist or not

    const { playlist, video } = await checkVideoAndPlaylist(videoId, playlistId, user.id);

    // now save the note into db
    await createNoteService({
      userId: user.id,
      playlistId,
      videoId,
      content,
      timestamp,
    });

    return NextResponse.json(
      { message: 'Note created successfully', success: true },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const videoId = req.nextUrl.searchParams.get('videoId');
    const playlistId = req.nextUrl.searchParams.get('playlistId');

    if (!videoId || !playlistId) {
      throw new AppError("Video ID and Playlist ID are required", 400, "VIDEO_ID_AND_PLAYLIST_ID_ARE_REQUIRED")
    }

    const result = getNotesSchema.safeParse({ videoId, playlistId });

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        throw new AppError(result.error.message, 400, 'INVALID_GET_NOTE_INPUT');
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

    // check videoId and playlistId are valid and video belongs to playlist or not

    const { playlist, video } = await checkVideoAndPlaylist(videoId, playlistId, user.id);

    const notes = await getNotes(videoId, user.id);
    return NextResponse.json(
      { messages: 'Notes fetched successfully', success: true, notes },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error)
  }
}
