import { handleApiError } from "@/lib/api/handleApiError";
import { requireAuth } from "@/lib/auth/requireAuth";
import { AppError } from "@/lib/errors/appError";
import { findUserByClerkUserId } from "@/server/dal/prisma/user.dal";
import { checkPlaylistBelongToCreatorService, joinCreatorPlaylistService } from "@/server/services/creator.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"

const joinCreatorPlaylistSchema = z.object({
    playlistId: z.string()
});

export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const { playlistId } = await req.json()

        const result = joinCreatorPlaylistSchema.safeParse({ playlistId })

        if (!result.success) {
            if (result.error instanceof z.ZodError) {
                throw new AppError(result.error.message, 400, "INVALID_INPUT")
            }
        }

        // now check user is logged in 

        const { userId: clerkUserId } = await requireAuth();

        const user = await findUserByClerkUserId(clerkUserId)

        if (!user) {
            throw new AppError("User Not Found", 404, "USER_NOT_FOUND")
        }

        // check the playlist is belong to the creator or not 

        await checkPlaylistBelongToCreatorService(playlistId);

        await joinCreatorPlaylistService(playlistId, user.id)

        return NextResponse.json(
            { message: 'Creator playlist joined successfully', success: true },
            { status: 200 }
        );


    } catch (error) {
        return handleApiError(error)
    }
}