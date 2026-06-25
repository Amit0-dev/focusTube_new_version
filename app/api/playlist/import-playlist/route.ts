import { handleApiError } from '@/lib/api/handleApiError';
import { requireRole } from '@/lib/auth/requireRole';
import { AppError } from '@/lib/errors/appError';
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
    const { clerkUserId } = await requireRole(['creator', 'learner', 'admin']);

    const { playlistUrl } = await req.json();

    if (!playlistUrl) {
      throw new AppError("Playlist URL is required", 400, "BAD_REQUEST")
    }

    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
      throw new AppError("Invalid playlist URL", 400, "BAD_REQUEST")
    }

    const result = await importPlaylistService({ clerkUserId, playlistId });

    return NextResponse.json(
      { message: 'Playlist imported successfully', success: true, playlist: result.createdPlaylist },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error)
  }
}
