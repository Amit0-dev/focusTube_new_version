import prisma from '@/lib/prisma';

export async function findPlaylistByYoutubePlaylistId(
  youtubePlaylistId: string,
) {
  const playlist = await prisma.playlist.findUnique({
    where: {
      youtubePlaylistId,
    },
  });

  return playlist;
}

export async function createPlaylist(
  playlistData: {
    youtubePlaylistId: string;
    userId: string;
    channelId: string;
    title: string;
    description?: string;
    publishedAt: Date;
    thumbnail: string;
    channelTitle: string;
    itemCount: number;
    kind: string;
  },
  videosData: Array<{
    youtubeVideoId: string;
    channelId: string;
    title: string;
    description?: string;
    publishedAt: Date;
    thumbnail: string;
    channelTitle: string;
    position: number;
    kind: string;
  }>,
) {
  try {
    const createdPlaylist = await prisma.playlist.create({
      data: {
        ...playlistData,
        video: {
          createMany: {
            data: videosData,
          },
        },
      },
    });

    return createdPlaylist;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw new Error('Failed to create playlist');
  }
}

export async function getAllPlaylists(clerkUserId: string) {
  const playlists = await prisma.playlist.findMany({
    where: {
      userId: clerkUserId,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
  return playlists;
}
