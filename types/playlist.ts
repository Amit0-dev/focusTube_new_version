interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface PlaylistResponseType {
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

export interface PlaylistItemResponseType {
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
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt: Date;
  };
  status: {
    privacyStatus: string;
  };
}

export interface PlaylistVideoType {
  kind: string;
  youtubeVideoId: string;
  title: string;
  description: string;
  channelId: string;
  publishedAt: Date;
  thumbnail: string;
  channelTitle: string;
  position: number;
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
  status: 'IN_PROGRESS' | 'NEW' | 'COMPLETED';
  completedVideosCount: number;
}
