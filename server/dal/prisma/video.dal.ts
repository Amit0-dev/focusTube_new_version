import prisma from '@/lib/prisma';

// TODO: get video of current loggedin User only
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

export async function updateVideoById(
  videoId: string,
  playlistId: string,
  userId: string,
  data: {
    isComplete: boolean;
    completedAt: Date;
  },
) {
  return await prisma.video.update({
    where: {
      id: videoId,
      Playlist: {
        id: playlistId,
        User: {
          id: userId,
        },
      },
    },
    data: {
      isComplete: data.isComplete,
      completedAt: data.completedAt,
    },
  });
}
