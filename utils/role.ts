import { Role } from '@/generated/prisma/enums';

export const roleMap = {
  learner: Role.LEARNER,
  creator: Role.CREATOR,
  admin: Role.ADMIN,
};
