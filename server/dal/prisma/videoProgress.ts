import prisma from '@/lib/prisma';

// TODO: make videoId, playlistId and userId unique for using findUnique
export async function getVideoProgress(
  videoId: string,
  userId: string,
  playlistId: string,
) {
  return await prisma.videoProgress.findFirst({
    where: {
      videoId,
      playlistId,
      userId,
    },
  });
}

export async function createVideoProgress({
  videoId,
  userId,
  playlistId,
  currentTime,
  totalDuration,
}: {
  videoId: string;
  userId: string;
  playlistId: string;
  currentTime: number;
  totalDuration: number;
}) {
  return await prisma.videoProgress.create({
    data: {
      videoId,
      userId,
      playlistId,
      lastPlayTime: currentTime,
      lastPlayedAt: new Date(Date.now()),
      totalDuration,
    },
  });
}

export async function updateVideoProgress({
  currentTime,
  isComplete,
  id,
  userId,
}: {
  currentTime: number;
  isComplete: boolean;
  id: string;
  userId: string;
}) {
  return await prisma.videoProgress.update({
    where: {
      id,
      userId,
    },
    data: {
      lastPlayTime: currentTime,
      isComplete,
    },
  });
}
