import { getAllCreatorPlaylistsService } from "@/server/services/playlist.service"
import { Playlist } from "@/types/playlist"
import DashboardCard from "./DashboardCard";
import SectionHeader from "./SectionHeader";
import CreatorPlaylistJoinCard from "./CreatorPlaylistJoinCard";
import { auth } from '@clerk/nextjs/server';
import { findUserByClerkUserId } from "@/server/dal/prisma/user.dal";

export default async function CreatorPlaylists() {

    let playlists: Playlist[] = []
    let errorMessage: string | null = null;

    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
        throw new Error("User not found")
    }

    const user = await findUserByClerkUserId(clerkUserId)

    if (!user) {
        throw new Error("User not found")
    }

    try {
        playlists = await getAllCreatorPlaylistsService()
    } catch (error) {
        console.error('Failed to fetch creator playlists:', error);
        errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch creator playlists';
    }

    if (errorMessage) {
        return (
            <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
                <div className="text-sm font-semibold text-red-100">
                    Could not load creator playlist
                </div>
                <div className="mt-1 text-sm text-red-100/70">{errorMessage}</div>
                {/* add a retry button here in case of error in future  */}
            </DashboardCard>
        );
    }

    return (
        <div className="space-y-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <SectionHeader
                    title="Creator Playlists"
                    subtitle="Enroll yourself for the playlists curated by creators"
                />

            </div>

            {playlists.length === 0 ? (
                <DashboardCard className="p-6">
                    <div className="text-sm font-semibold text-white">
                        No playlists yet
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                        Import a YouTube playlist to get started.
                    </div>
                </DashboardCard>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {playlists.map((playlist) => (
                        <CreatorPlaylistJoinCard key={playlist.id} channelTitle={playlist.channelTitle} id={playlist.id} itemCount={playlist.itemCount} thumbnail={playlist.thumbnail} title={playlist.title} userId={user.id} />
                    ))}
                </div>
            )}
        </div>
    )
}