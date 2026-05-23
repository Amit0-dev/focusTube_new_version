import prisma from '@/lib/prisma';

import { requireRole } from '../auth/requireRole';

export async function getUserPlaylists() {
  const { clerkUserId } = await requireRole(['learner']);

  console.log('Fetching playlists for user:', clerkUserId);

  const playlist = await prisma.playlist.findMany({
    where: {
      User: {
        clerkUserId,
      },
    },
  });

  console.log('Playlists fetched from database:', playlist);

  if (playlist.length === 0) {
    return [];
  }

  return playlist;
}
