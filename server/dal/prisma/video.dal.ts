import prisma from '@/lib/prisma';

// TODO: get video of current loggedin User only
export async function getAllVideosByPlaylistId(playlistId: string) {
  return await prisma.video.findMany({
    where: {
      playlistId,
    },
  });
}

export async function getVideoById(
  videoId: string,
  playlistId: string,
  userId: string,
) {
  return await prisma.video.findFirst({
    where: {
      id: videoId,
      Playlist: {
        id: playlistId,
        User: {
          id: userId,
        },
      },
    },
  });
}
