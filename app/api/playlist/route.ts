import { requireRole } from '@/lib/auth/requireRole';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const { playlistId } = await req.json();
    const { clerkUserId } = await requireRole(['creator', 'learner']);

    const existingPlaylist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
        User: {
          clerkUserId,
        },
      },
    });

    if (!existingPlaylist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 },
      );
    }

    const deletedPlaylist = await prisma.playlist.delete({
      where: {
        id: playlistId,
        User: {
          clerkUserId,
        },
      },
    });
    return NextResponse.json(
      { message: 'Playlist deleted successfully', deletedPlaylist },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete playlist' },
      { status: 500 },
    );
  }
}
