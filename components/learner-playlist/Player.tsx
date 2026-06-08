'use client';

import { apiFetch } from '@/lib/api/apiFetch';
import { ERROR_CODES } from '@/utils/player';
import { throttle } from '@/utils/useThrottling';
import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { z } from 'zod';

export default function Player({
  videoId,
  videoTitle,
  playlistId,
  videoIdYt,
}: {
  videoId: string;
  videoTitle: string;
  playlistId: string;
  videoIdYt: string;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const throttledUpdateRef = useRef<Function | null>(null);
  const throttledCreateRef = useRef<Function | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateVideoProgress(
    currentTime: number,
    isCompleted: boolean,
    playlistId: string,
    videoId: string,
  ) {
    try {
      const payload = {
        currentTime,
        isCompleted,
        playlistId,
        videoId,
      };

      const result = z
        .object({
          currentTime: z.number(),
          isCompleted: z.boolean(),
          playlistId: z.string(),
          videoId: z.string(),
        })
        .safeParse(payload);

      if (!result.success) {
        throw new Error('Invalid video progress data');
      }

      const response = await apiFetch('/api/videoProgress', {
        method: 'PATCH',
        body: JSON.stringify(result.data),
      });

      if (!response) {
        throw new Error('Failed to update video progress');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error('Failed to update video progress');
    }
  }

  async function createVideoProgress(
    videoId: string,
    playlistId: string,
    currentTime: number,
    totalDuration: number,
  ) {
    try {
      const payload = {
        videoId,
        playlistId,
        currentTime,
        totalDuration,
      };

      const result = z
        .object({
          videoId: z.string(),
          playlistId: z.string(),
          currentTime: z.number(),
          totalDuration: z.number(),
        })
        .safeParse(payload);

      if (!result.success) {
        throw new Error('Invalid video progress data');
      }

      const response = await apiFetch('/api/videoProgress', {
        method: 'POST',
        body: JSON.stringify(result.data),
      });

      if (!response) {
        throw new Error('Failed to create video progress');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error('Failed to create video progress');
    }
  }

  const onPlayerReady = async (e: YouTubeEvent) => {};

  const onEnd = async (e: YouTubeEvent) => {
    try {
      const currentTime = e.target.getCurrentTime();
      const duration = e.target.getDuration();

      console.log('currrent time : ', currentTime, ' duration: ', duration);
      console.log('completed: ', currentTime / duration >= 0.9);

      await updateVideoProgress(
        currentTime,
        currentTime / duration >= 0.9, // consider video completed if 90% or more is watched
        playlistId,
        videoId,
      );
    } catch (error) {
      console.error('Failed to update video progress:', error);
      setError('Failed to update video progress');
    }
  };

  const onPause = async (e: YouTubeEvent) => {
    try {
      const currentTime = e.target.getCurrentTime();
      const totalDuration = e.target.getDuration();

      await throttledUpdateRef.current?.(
        currentTime,
        currentTime / totalDuration >= 0.9, // consider video completed if 90% or more is watched
        playlistId,
        videoId,
      );

      console.log('Video paused at time and updated : ', currentTime);
    } catch (error) {
      console.error('Failed to update video progress:', error);
      setError('Failed to update video progress');
    }
  };

  const onStateChange = async (e: YouTubeEvent) => {
    switch (e.data) {
      case window.YT.PlayerState.PLAYING:
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            const currentTime = e.target.getCurrentTime();
            lastTimeRef.current = currentTime;

            // send currentTime to backend
            throttledUpdateRef.current?.(
              currentTime,
              false,
              playlistId,
              videoId,
            );

            console.log('current time: ', currentTime);
          }, 1000);
        }

        break;
      case window.YT.PlayerState.PAUSED:
      case window.YT.PlayerState.ENDED:
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        break;
    }
  };

  const onError = async (e: YouTubeEvent) => {
    try {
      const errorCode = e.data;

      const errorMessage =
        ERROR_CODES[errorCode as keyof typeof ERROR_CODES] || 'Unknown error';
      setError(errorMessage);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const onPlay = async (e: YouTubeEvent) => {
    try {
      // add seekTo to lastPlayedTime - later

      const currentTime = e.target.getCurrentTime();
      const totalDuration = e.target.getDuration();

      // send req to backend and create progress
      await throttledCreateRef.current?.(
        videoId,
        playlistId,
        currentTime,
        totalDuration,
      );

      console.log('Video progress created with currentTime: ', currentTime);
    } catch (error) {
      console.error('Failed to create video progress:', error);
      setError('Failed to create video progress');
    }
  };

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    throttledUpdateRef.current = throttle(
      updateVideoProgress,
      10000, // 10 sec
    );

    throttledCreateRef.current = throttle(
      createVideoProgress,
      10000, // 10 sec
    );
  }, []);

  if (error) {
    console.error('Player error:', error);
  }

  return (
    <div>
      <YouTube
        className="aspect-video w-full"
        opts={opts}
        loading="lazy"
        onEnd={onEnd}
        onError={onError}
        videoId={videoIdYt}
        title={videoTitle}
        key={videoId}
        onPlay={onPlay}
        onPause={onPause}
        onStateChange={onStateChange}
        onReady={onPlayerReady}
      />
    </div>
  );
}
