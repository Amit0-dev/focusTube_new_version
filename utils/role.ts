import { Role } from '@/generated/prisma/enums';
import { PlaylistStatus } from '@/generated/prisma/enums';

export const roleMap = {
  learner: Role.LEARNER,
  creator: Role.CREATOR,
  admin: Role.ADMIN,
};

export const playlistStatusMap = {
  new: PlaylistStatus.NEW,
  inProgress: PlaylistStatus.IN_PROGRESS,
  completed: PlaylistStatus.COMPLETED,
};
