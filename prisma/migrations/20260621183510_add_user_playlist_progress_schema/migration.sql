/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `completedVideosCount` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `isComplete` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,playlistId]` on the table `CreatorSpace` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[videoId,userId,playlistId]` on the table `VideoProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "completedAt",
DROP COLUMN "completedVideosCount",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "completedAt",
DROP COLUMN "isComplete";

-- CreateTable
CREATE TABLE "UserPlaylistProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "completedVideosCount" INTEGER NOT NULL DEFAULT 0,
    "status" "PlaylistStatus" NOT NULL DEFAULT 'NEW',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPlaylistProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPlaylistProgress_userId_playlistId_key" ON "UserPlaylistProgress"("userId", "playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorSpace_userId_playlistId_key" ON "CreatorSpace"("userId", "playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoProgress_videoId_userId_playlistId_key" ON "VideoProgress"("videoId", "userId", "playlistId");

-- AddForeignKey
ALTER TABLE "UserPlaylistProgress" ADD CONSTRAINT "UserPlaylistProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlaylistProgress" ADD CONSTRAINT "UserPlaylistProgress_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
