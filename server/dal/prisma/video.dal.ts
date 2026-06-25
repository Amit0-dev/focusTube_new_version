import prisma from '@/lib/prisma';

export async function getAllVideosByPlaylistId(playlistId: string) {
  return await prisma.video.findMany({
    where: {
      playlistId,
    },
    orderBy: {
      position: 'asc',
    },
  });
}

export async function getVideoByIdAndPlaylist(
  videoId: string,
  playlistId: string,
) {
  return await prisma.video.findFirst({
    where: {
      id: videoId,
      Playlist: {
        id: playlistId,
      },
    },
  });
}
