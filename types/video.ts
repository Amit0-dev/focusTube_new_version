import { Thumbnail } from "./playlist";

export interface YtPlaylistItemResponse {
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


export interface Video {
    playlistId?: string;
    id?: string;
    kind: string;
    youtubeVideoId: string;
    title: string;
    description: string | null;
    channelId: string;
    publishedAt: Date;
    thumbnail: string;
    channelTitle: string;
    position: number;
}