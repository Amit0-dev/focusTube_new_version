import { requireRole } from '@/lib/auth/requireRole';
import prisma from '@/lib/prisma';
import { fetchPlaylist, fetchPlaylistVideos } from '@/youtubeApi';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { clerkUserId } = await requireRole(['creator', 'learner']);

    const { playlistUrl } = await req.json();

    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*[?&]list=([a-zA-Z0-9_-]+).*/;

    const isMatch = regex.test(playlistUrl);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid YouTube playlist URL' },
        { status: 400 },
      );
    }

    const url = new URL(playlistUrl);

    const isIdAvailable = url.searchParams.has('list');

    if (!isIdAvailable) {
      return NextResponse.json(
        { error: 'Invalid YouTube playlist URL' },
        { status: 400 },
      );
    }

    const playlistId = url.searchParams.get('list');

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Invalid YouTube playlist URL' },
        { status: 400 },
      );
    }

    const response = await fetchPlaylist({
      playlistId,
    });

    if (!response) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const playlistObj = response.map((r) => ({
      kind: r.kind,
      youtubePlaylistId: r.id,
      userId: user.id,
      title: r.snippet.title,
      description: r.snippet.description,
      channelId: r.snippet.channelId,
      publishedAt: r.snippet.publishedAt,
      thumbnail: r.snippet.thumbnails.standard.url || '',
      channelTitle: r.snippet.channelTitle,
      itemCount: r.contentDetails.itemCount,
    }));

    // now fetch all the videos of this playlist

    const playlistVideos = await fetchPlaylistVideos({
      playlistId,
    });

    // save the playlist and its videos to the database

    let createdPlaylist: any = null;
    try {
      const existingPlaylist = await prisma.playlist.findUnique({
        where: {
          youtubePlaylistId: playlistId,
        },
      });

      if (existingPlaylist) {
        return NextResponse.json(
          { error: 'Playlist already exists' },
          { status: 400 },
        );
      }

      createdPlaylist = await prisma.playlist.create({
        data: playlistObj[0],
      });

      console.log('createdPlaylist', createdPlaylist);
      if (!createdPlaylist) {
        throw new Error('Failed to save playlist to database');
      }

      const videoData = playlistVideos.map((video) => ({
        ...video,
        playlistId: createdPlaylist.id,
      }));

      const createdVideos = await prisma.video.createMany({
        data: videoData,
      });

      console.log('createdVideos', createdVideos);

      if (!createdVideos) {
        throw new Error('Failed to save videos to database');
      }
    } catch (error) {
      console.error('Error saving playlist and videos to database:', error);
      if (createdPlaylist?.id) {
        await prisma.playlist.delete({
          where: { id: createdPlaylist.id },
        });

        console.log('Deleted playlist with id: ', createdPlaylist.id);

        return NextResponse.json(
          { error: 'Failed to save playlist and videos to database' },
          { status: 500 },
        );
      }
    }

    // return success response

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
