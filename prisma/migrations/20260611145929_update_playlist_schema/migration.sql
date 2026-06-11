-- CreateEnum
CREATE TYPE "PlaylistStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completedVideosCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "PlaylistStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;
