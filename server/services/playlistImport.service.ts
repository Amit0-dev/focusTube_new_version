import { fetchPlaylist, fetchPlaylistVideos } from '../api/youtube.api';
import {
  createPlaylist,
  findPlaylistByYoutubePlaylistId,
} from '../dal/prisma/playlist.dal';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';

export async function importPlaylistService(args: {
  clerkUserId: string;
  playlistId: string;
}) {
  // first check user is valid or not

  const user = await findUserByClerkUserId(args.clerkUserId);

  if (!user) {
    throw new Error('User not found');
  }

  // check wheather playlist exists or not with this playlistId or not

  const existingPlaylist = await findPlaylistByYoutubePlaylistId(
    args.playlistId,
  );

  if (existingPlaylist) {
    throw new Error('Playlist already exists');
  }

  // now fetch the playlist through yt apis

  const playlistResponse = await fetchPlaylist({ playlistId: args.playlistId });

  if (!playlistResponse?.length) {
    throw new Error('Invalid response');
  }

  const playlistItem = playlistResponse[0];

  // now fetch the videos

  const videos = await fetchPlaylistVideos({ playlistId: args.playlistId });

  console.log(
    `Video fetched - ${playlistItem.snippet.title} : `,
    videos.length,
  );

  // now call dal to save data into db

  try {
    const createdPlaylist = await createPlaylist(
      {
        youtubePlaylistId: playlistItem.id,
        userId: user.id,
        kind: playlistItem.kind,
        title: playlistItem.snippet.title,
        description: playlistItem.snippet.description,
        channelId: playlistItem.snippet.channelId,
        publishedAt: new Date(playlistItem.snippet.publishedAt),
        thumbnail: playlistItem.snippet.thumbnails.standard.url || '',
        channelTitle: playlistItem.snippet.channelTitle,
        itemCount: playlistItem.contentDetails.itemCount,
      },
      videos.map((video) => ({
        youtubeVideoId: video.youtubeVideoId,
        channelId: video.channelId,
        title: video.title,
        description: video.description,
        publishedAt: new Date(video.publishedAt),
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        position: video.position,
        kind: video.kind,
      })),
    );

    if (!createdPlaylist) {
      throw new Error('Failed to create playlist');
    }
  } catch (error) {
    console.error('Error in importPlaylistService: ', error);

    throw new Error('Failed to import playlist');
  }
}
