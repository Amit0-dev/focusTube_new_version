import prisma from '@/lib/prisma';

export async function getAllVideosByPlaylistId(playlistId: string) {
  return await prisma.video.findMany({
    where: {
      playlistId,
    },
  });
}
