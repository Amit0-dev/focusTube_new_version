import { PlaylistStatus } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';

export async function findPlaylistByYoutubePlaylistId(
  youtubePlaylistId: string,
  userId: string
) {
  const playlist = await prisma.playlist.findUnique({
    where: {
      youtubePlaylistId_userId: {
        youtubePlaylistId,
        userId
      }
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
  return await prisma.playlist.create({
    data: {
      ...playlistData,
      video: {
        createMany: {
          data: videosData,
        },
      },
    },
  });
}

export async function getPlaylistById(playlistId: string) {
  return await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
  });
}

export async function getAllCreatorPlaylists(userId: string) {
  return await prisma.playlist.findMany({
    where: {
      User: {
        role: "CREATOR"
      },
      NOT: {
        UserPlaylistProgress: {
          some: {
            userId: userId
          }
        }
      }
    }
  })
}

export async function getPlaylistsOwnByCreator(userId: string) {
  return await prisma.playlist.findMany({
    where: {
      userId
    }
  })
}

// TODO: need to recheck again..
export async function getJoinedUserCountOfCreatorPlaylist(playlistId: string) {
  return await prisma.creatorSpace.count({
    where: {
      Playlist: {
        id: playlistId
      }
    }
  })
}
