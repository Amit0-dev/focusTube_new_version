import { requireRole } from '@/lib/auth/requireRole';
import { importPlaylistService } from '@/server/services/playlistImport.service';
import { NextRequest, NextResponse } from 'next/server';

function extractPlaylistId(url: string): string | null {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*[?&]list=([a-zA-Z0-9_-]+).*/;

  const isMatch = regex.test(url);

  if (!isMatch) {
    return null;
  }

  const urlObj = new URL(url);

  const isIdAvailable = urlObj.searchParams.has('list');

  if (!isIdAvailable) {
    return null;
  }

  const id = urlObj.searchParams.get('list');

  if (!id) {
    return null;
  }

  return id;
}

export async function POST(req: NextRequest) {
  try {
    const { clerkUserId } = await requireRole(['creator', 'learner']);

    const { playlistUrl } = await req.json();

    if (!playlistUrl) {
      return NextResponse.json(
        { error: 'Playlist URL is required' },
        { status: 400 },
      );
    }

    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Invalid YouTube playlist URL' },
        { status: 400 },
      );
    }

    await importPlaylistService({ clerkUserId, playlistId });

    return NextResponse.json(
      { message: 'Playlist imported successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error importing playlist:', error);
    return NextResponse.json(
      { error: 'Failed to import playlist' },
      { status: 500 },
    );
  }
}
