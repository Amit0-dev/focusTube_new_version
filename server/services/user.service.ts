import { requireAuth } from "@/lib/auth/requireAuth";
import { findUserByClerkUserId } from "../dal/prisma/user.dal";
import { AppError } from "@/lib/errors/appError";

export async function getCurrentLoggedInUserId() {

    const { userId: clerkUserId } = await requireAuth();

    if (!clerkUserId) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await findUserByClerkUserId(clerkUserId);

    if (!user) {
        throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    return {
        user,
        userId: user.id
    };
}