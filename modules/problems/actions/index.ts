"use server";

import { prisma } from "@/lib/databaseConnection";
import { UserRole } from "@/lib/generated/prisma/enums";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getAllProblems = async () => {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        const data = await prisma.user.findUnique({
            where: { clerkId: user.id },
            select: { id: true },
        });

        if (!data) throw new Error("User not found");

        const problems = await prisma.problem.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: problems };
    } catch (error) {
        console.error("❌ Error fetching problems:", error);
        return { success: false, error: "Failed to fetch problems" };
    }
};

export const getProblemById = async (id: string) => {
    try {
        const problem = await prisma.problem.findUnique({
            where: { id },
        });
        return { success: true, data: problem };
    } catch (error) {
        console.error("❌ Error fetching problem:", error);
        return { success: false, error: "Failed to fetch problem" };
    }
}

export const deleteProblem = async (problemId: string) => {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
            select: { role: true }
        });

        if (dbUser?.role !== UserRole.ADMIN) {
            throw new Error("Only admins can delete problems");
        }

        await prisma.problem.delete({
            where: { id: problemId }
        });

        revalidatePath("/problems");
        return { success: true, message: "Problem deleted successfully" };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to delete problem";
        console.error("Error deleting problem:", message);
        return { success: false, error: message };
    }
}

export const executeCode = async (
    source_code: string,
    language_id: number,
    stdin: string[],
    expected_outputs: string[],
    id: string
) => {
    return { success: false, error: "Schema needs Submission and TestCaseResult models" };
}

export const getAllSubmissionByCurrentUserForProblem = async (problemId: string) => {
    return { success: false, error: "Schema needs Submission model" };
}
