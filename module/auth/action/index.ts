"use server";

import { prisma } from "@/lib/databaseConnection";
import { currentUser } from "@clerk/nextjs/server";

export async function onBoardUser() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }
        const { id, firstName, lastName, emailAddresses, imageUrl } = user;

        const newUser = await prisma?.user.upsert({
            where: { clerkId: id },
            update: {
                firstName: firstName || "",
                lastName: lastName || "",
                email: emailAddresses[0]?.emailAddress || "",
                imageUrl: imageUrl || "",
            },
            create: {
                clerkId: id,
                firstName: firstName || "",
                lastName: lastName || "",
                email: emailAddresses[0]?.emailAddress || "",
                imageUrl: imageUrl || "",
            },
        });

        return {
            success: true,
            user: newUser,
            message: "User onboarded successfully",
        }
    } catch (error) {
        console.error("Error onboarding user:", error);
        return {
            success: false,
            user: null,
            message: "Failed to onboard user",
        }
    }
}