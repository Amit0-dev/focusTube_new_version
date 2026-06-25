/*
  Warnings:

  - A unique constraint covering the columns `[youtubePlaylistId,userId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[youtubeVideoId,playlistId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Playlist_youtubePlaylistId_key";

-- DropIndex
DROP INDEX "Video_youtubeVideoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_youtubePlaylistId_userId_key" ON "Playlist"("youtubePlaylistId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_youtubeVideoId_playlistId_key" ON "Video"("youtubeVideoId", "playlistId");
