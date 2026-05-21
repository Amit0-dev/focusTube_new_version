import {
  PlaylistItemResponseType,
  PlaylistResponseType,
  PlaylistVideoType,
} from '@/types/playlist';
import axios from 'axios';
import 'dotenv/config';

export async function fetchPlaylist({
  playlistId,
}: {
  playlistId: string;
}): Promise<PlaylistResponseType[]> {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY as string;

    if (!API_KEY) {
      throw new Error('Google Api Key is missing.');
    }

    const URL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cstatus%2Cid&key=${API_KEY}&id=${playlistId}`;

    const response = await axios.get(URL);

    if (response.status !== 200) {
      throw new Error('Failed to fetch playlist from youtube.');
    }

    return response.data.items;
  } catch (error) {
    throw new Error('Failed to fetch playlist from youtube.');
  }
}

export async function fetchPlaylistVideos({
  playlistId,
}: {
  playlistId: string;
}): Promise<PlaylistVideoType[]> {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY as string;

    if (!API_KEY) {
      throw new Error('Google Api Key is missing.');
    }

    let videos: PlaylistVideoType[] = [];
    let nextPageToken: string = '';

    while (true) {
      const URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails%2Cstatus%2Cid&playlistId=${playlistId}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`;

      const response = await axios.get(URL);

      if (response.status !== 200) {
        throw new Error("Failed to fetch playlist's videos from youtube.");
      }

      response.data.items.forEach((item: PlaylistItemResponseType) => {
        videos.push({
          kind: item.kind,
          youtubeVideoId: item.contentDetails.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          channelId: item.snippet.channelId,
          publishedAt: item.contentDetails.videoPublishedAt,
          thumbnail: item.snippet.thumbnails.standard.url || '',
          channelTitle: item.snippet.channelTitle,
          position: item.snippet.position,
        });
      });

      if (response.data.nextPageToken) {
        nextPageToken = response.data.nextPageToken;
      } else {
        break;
      }
    }

    return videos;
  } catch (error) {
    throw new Error("Failed to fetch playlist's videos from youtube.");
  }
}
