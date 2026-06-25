import { PlaylistStatus } from "@/generated/prisma/enums";

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YtPlaylistResponse {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
      standard: Thumbnail;
      maxres: Thumbnail;
    };
    channelTitle: string;
    localized: {
      title: string;
      description: string;
    };
  };
  status: {
    privacyStatus: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

export interface Playlist {
  id: string;
  youtubePlaylistId: string;
  userId: string;
  title: string;
  description: string | null;
  channelId: string;
  publishedAt: Date;
  thumbnail: string;
  channelTitle: string;
  kind: string;
  itemCount: number;
}

export interface LearnerPlaylist {
  completedVideosCount: number;
  status: PlaylistStatus;
  completedAt: Date | null;
  Playlist: {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    youtubePlaylistId: string;
    title: string;
    description: string | null;
    channelId: string;
    publishedAt: Date;
    thumbnail: string;
    channelTitle: string;
    kind: string;
    itemCount: number;
  };
}
