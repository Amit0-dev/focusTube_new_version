import { requireRole } from '@/lib/auth/requireRole';
import {
  deleteNoteService,
  updateNoteService,
} from '@/server/services/note.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> },
) {
  try {
    const { noteId } = await params;
    const { content } = await req.json();

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 },
      );
    }

    const result = z.string().min(1, 'Content is required').safeParse(content);

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

    await updateNoteService(noteId, content);

    return NextResponse.json(
      { message: 'Note updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error updating note: ', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ noteId: string }>;
  },
) {
  try {
    console.log('Received DELETE request for note with params: ', params);
    const { noteId } = await params;

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

    await deleteNoteService(noteId);

    return NextResponse.json(
      { message: 'Note deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log('Error deleting note: ', error);

    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 },
    );
  }
}
