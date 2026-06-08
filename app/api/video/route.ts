import { requireRole } from '@/lib/auth/requireRole';
import { getAllVideosByPlaylistId } from '@/server/dal/prisma/video.dal';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // TODO: add pagination (may be show more type something)
  try {
    const playlistId = req.nextUrl.searchParams.get('playlistId');
    if (!playlistId) {
      return NextResponse.json(
        { error: 'playlistId is required' },
        { status: 400 },
      );
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

    const videos = await getAllVideosByPlaylistId(playlistId);

    return NextResponse.json(
      { message: 'Videos fetched successfully', videos },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 },
    );
  }
}
