import { updateVideoProgress } from '../dal/prisma/videoProgress';

export async function updateVideoProgressService({
  currentTime,
  isComplete,
  id,
  userId,
}: {
  currentTime: number;
  isComplete: boolean;
  id: string;
  userId: string;
}) {
  try {
    let completedAt: Date | null = null;

    if (isComplete) {
      completedAt = new Date();
    }

    const result = await updateVideoProgress({
      currentTime,
      isComplete,
      id,
      userId,
      completedAt,
    });

    if(!result) {
        throw new Error('Failed to update video progress');
    }

    return result;
  } catch (error) {
    console.log('Error in updating video progress: ', error);
    throw new Error('Failed to update video progress');
  }
}
