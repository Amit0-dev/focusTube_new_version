-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
