import { AppError } from '@/lib/errors/appError';
import {
  YtPlaylistResponse,
} from '@/types/playlist';
import { Video, YtPlaylistItemResponse } from '@/types/video';
import axios from 'axios';
import 'dotenv/config';

export async function fetchPlaylist({
  playlistId,
}: {
  playlistId: string;
}): Promise<YtPlaylistResponse[]> {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY as string;

    if (!API_KEY) {
      throw new AppError("Google Api Key is missing.", 500, "GOOGLE_API_KEY_MISSING")
    }

    const URL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cstatus%2Cid&key=${API_KEY}&id=${playlistId}`;

    const response = await axios.get(URL);

    if (response.status !== 200) {
      throw new AppError("Failed to fetch playlist from youtube.", 400, "FAILED_TO_FETCH_PLAYLIST")
    }

    return response.data.items;
  } catch (error) {
    throw new AppError("Failed to fetch playlist from youtube.", 400, "FAILED_TO_FETCH_PLAYLIST")
  }
}

export async function fetchPlaylistVideos({
  playlistId,
}: {
  playlistId: string;
}): Promise<Video[]> {
  try {
    const API_KEY = process.env.GOOGLE_API_KEY as string;

    if (!API_KEY) {
      throw new AppError("Google Api Key is missing.", 500, "GOOGLE_API_KEY_MISSING")
    }

    let videos: Video[] = [];
    let nextPageToken: string = '';

    while (true) {
      const URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails%2Cstatus%2Cid&playlistId=${playlistId}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`;

      const response = await axios.get(URL);

      if (response.status !== 200) {
        throw new AppError("Failed to fetch playlist's videos from youtube.", 400, "FAILED_TO_FETCH_PLAYLIST_VIDEOS")
      }

      response.data.items.forEach((item: YtPlaylistItemResponse) => {
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
    throw new AppError("Failed to fetch playlist's videos from youtube.", 400, "FAILED_TO_FETCH_PLAYLIST_VIDEOS")
  }
}
