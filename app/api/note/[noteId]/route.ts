import { handleApiError } from '@/lib/api/handleApiError';
import { requireAuth } from '@/lib/auth/requireAuth';
import { AppError } from '@/lib/errors/appError';
import { findUserByClerkUserId } from '@/server/dal/prisma/user.dal';
import {
  deleteNoteService,
  updateNoteService,
} from '@/server/services/note.service';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> },
) {
  try {
    const { noteId } = await params;
    const { content } = await req.json();

    if (!noteId) {
      throw new AppError("Note ID is required", 400, "INVALID_INPUT")
    }

    const result = z.string().min(1, 'Content is required').safeParse(content);

    if (!result.success) {
      if (result.error instanceof z.ZodError) {
        throw new AppError(result.error.message, 400, "INVALID_INPUT")
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

    await updateNoteService(noteId, content, user.id);

    return NextResponse.json(
      { message: 'Note updated successfully', success: true },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error)
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
    const { noteId } = await params;

    if (!noteId) {
      throw new AppError("Note ID is required", 400, "INVALID_INPUT")
    }

    const { userId: clerkUserId } = await requireAuth()

    if (!clerkUserId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    await deleteNoteService(noteId, user.id);

    return NextResponse.json(
      { message: 'Note deleted successfully', success: true },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error)
  }
}
