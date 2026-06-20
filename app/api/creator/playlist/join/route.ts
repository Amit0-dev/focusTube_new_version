import { requireAuth } from "@/lib/auth/requireAuth";
import { checkPlaylistBelongToCreatorService, joinCreatorPlaylistService } from "@/server/services/playlist.service";
import { NextRequest, NextResponse } from "next/server";
import { success, z } from "zod"

const joinCreatorPlaylistSchema = z.object({
    playlistId: z.string(),
    userId: z.string(),
});

export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const { userId, playlistId } = await req.json()

        const result = joinCreatorPlaylistSchema.safeParse({ userId, playlistId })

        if (!result.success) {
            if (result.error instanceof z.ZodError) {
                return NextResponse.json(
                    { error: result.error.message },
                    { status: 400 },
                );
            }
        }

        // now check user is logged in 

        const { userId: clerkUserId } = await requireAuth();

        if (!clerkUserId) {
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                },
                { status: 401 },
            );
        }

        // check the playlist is belong to the creator or not 

        const { isPlaylistBelongToCreator } = await checkPlaylistBelongToCreatorService(playlistId);

        if (isPlaylistBelongToCreator) {
            // that means it is belong to creator
            // now we can join

            const response = await joinCreatorPlaylistService(playlistId, userId)

            if (!response) {
                return NextResponse.json(
                    {
                        error: 'Failed to join creator playlist',
                    },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    data: response,
                },
                { status: 200 },
            );
        }

        return NextResponse.json(
            { success: false, message: 'Playlist does not belong to creator' },
            { status: 400 }
        )

    } catch (error) {
        console.log('Error joining creator playlist: ', error);
        return NextResponse.json(
            { error: 'Failed to join creator playlist' },
            { status: 500 },
        );
    }
}