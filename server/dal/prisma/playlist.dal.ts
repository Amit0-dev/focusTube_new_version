import { PlaylistStatus } from '@/generated/prisma/enums';
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
      createdAt: 'desc',
    },
  });
  return playlists;
}

export async function getPlaylistById(playlistId: string, userId: string) {
  return await prisma.playlist.findUnique({
    where: {
      id: playlistId,
      User: {
        id: userId,
      },
    },
  });
}

export async function getPlaylistByIdForJoin(playlistId: string) {
  return await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });
}

export async function updatePlaylistStatusById(
  playlistId: string,
  userId: string,
  status: PlaylistStatus,
  completedAt: Date,
) {
  return await prisma.playlist.update({
    where: {
      id: playlistId,
      User: {
        id: userId,
      },
    },
    data: {
      status,
      completedAt,
    },
  });
}

export async function updatePlaylistCompletedVideosCountById(
  playlistId: string,
  userId: string,
) {
  return await prisma.playlist.update({
    where: {
      id: playlistId,
      User: {
        id: userId,
      },
    },
    data: {
      completedVideosCount: {
        increment: 1,
      },
    },
  });
}

export async function markPlaylistAsInProgress(
  playlistId: string,
  userId: string,
) {
  return await prisma.playlist.update({
    where: {
      id: playlistId,
      User: {
        id: userId,
      },
    },
    data: {
      status: PlaylistStatus.IN_PROGRESS,
    },
  });
}

export async function joinCreatorPlaylist(playlistId: string, userId: string) {
  return await prisma.creatorSpace.create({
    data: {
      userId,
      playlistId
    }
  })
}

export async function isUserAlreadyJoinedPlaylist(playlistId: string, userId: string) {
  return await prisma.creatorSpace.findFirst({
    where: {
      playlistId,
      userId,
    }
  })
}

export async function getAllCreatorPlaylists() {
  return await prisma.playlist.findMany({
    where: {
      User: {
        role: "CREATOR"
      }
    }
  })
}

export async function getJoinedUserCountOfCreatorPlaylist(playlistId: string) {
  return await prisma.creatorSpace.count({
    where: {
      Playlist: {
        id: playlistId
      }
    }
  })
}

export async function getJoinedUsersOfCreatorPlaylist(playlistId: string) {
  return await prisma.creatorSpace.findMany({
    where: {
      Playlist: {
        id: playlistId
      }
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  })
}

export async function getUserEnrolledCreatorPlaylist(userId: string) {
  return await prisma.creatorSpace.findMany({
    where: {
      userId
    },
    include: {
      Playlist: true
    }
  })
}