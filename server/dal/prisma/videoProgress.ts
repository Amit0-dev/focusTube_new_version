import prisma from '@/lib/prisma';

export async function getVideoProgress(
  videoId: string,
  userId: string,
  playlistId: string,
) {
  return await prisma.videoProgress.findUnique({
    where: {
      videoId_userId_playlistId: {
        videoId,
        userId,
        playlistId
      }
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
  completedAt,
}: {
  currentTime: number;
  isComplete: boolean;
  id: string;
  userId: string;
  completedAt: Date | null;
}) {
  return await prisma.videoProgress.update({
    where: {
      id,
      userId,
    },
    data: {
      lastPlayTime: currentTime,
      isComplete,
      completedAt,
    },
  });
}
