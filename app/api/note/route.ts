import { requireRole } from '@/lib/auth/requireRole';
import { getNotesByVideoId } from '@/server/dal/prisma/note.dal';
import { createNoteService } from '@/server/services/note.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const noteSchema = z.object({
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

    const result = noteSchema.safeParse({ content, timestamp, playlistId, videoId });

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 },
        );
      }
    }

    // now check user is logged in and has the right role

    const { clerkUserId } = await requireRole(['learner']);

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    // now save the note into db
    await createNoteService({
      clerkUserId,
      playlistId,
      videoId,
      content,
      timestamp,
    });

    return NextResponse.json(
      { message: 'Note created successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error creating note: ', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const videoId = req.nextUrl.searchParams.get('videoId');
    const playlistId = req.nextUrl.searchParams.get('playlistId');

    if (!videoId || !playlistId) {
      return NextResponse.json(
        { error: 'videoId and playlistId are required' },
        { status: 400 },
      );
    }

    const result = getNotesSchema.safeParse({ videoId, playlistId });

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 },
        );
      }
    }

    const { clerkUserId } = await requireRole(['learner']);

    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const notes = await getNotesByVideoId(videoId);
    return NextResponse.json(
      { messages: 'Notes fetched successfully', notes },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error fetching notes: ', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 },
    );
  }
}
