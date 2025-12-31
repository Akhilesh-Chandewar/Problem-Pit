import { UserRole } from "@/lib/generated/prisma/enums";
import { getCurrentUserRole } from "@/module/auth/action";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/databaseConnection";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import {
    getJudge0LanguageId,
    submitBatch,
    pollBatchResults,
} from "@/lib/judge0";

export async function POST(request: NextRequest) {
    try {
        const userRole = await getCurrentUserRole();
        const user = await currentUser();

        if (!user || userRole.role !== UserRole.ADMIN) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await request.json();
        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            hint,
            editor,
            testCases,
            codeSnippet,
            referenceSolution,
        } = body;

        // ✅ Basic validation
        if (
            !title ||
            !description ||
            !difficulty ||
            !testCases ||
            !codeSnippet ||
            !referenceSolution
        ) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return new NextResponse("At least one test case is required", {
                status: 400,
            });
        }

        if (!referenceSolution || typeof referenceSolution !== "object") {
            return new NextResponse(
                "Reference solution must be provided for all supported languages",
                { status: 400 }
            );
        }

        // ✅ Validate reference solutions via Judge0
        for (const [language, solutionCode] of Object.entries(referenceSolution)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return new NextResponse(`Unsupported language: ${language}`, {
                    status: 400,
                });
            }

            // Prepare Judge0 submissions
            const submissions = testCases.map(
                ({ input, output }: { input: string; output: string }) => ({
                    source_code: solutionCode,
                    language_id: languageId,
                    stdin: input,
                    expected_output: output,
                })
            );

            // Submit batch
            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res: any) => res.token);

            // Poll results
            const results = await pollBatchResults(tokens);

            // Validate each test case
            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return NextResponse.json(
                        {
                            error: `Validation failed for ${language}`,
                            testCase: {
                                input: submissions[i].stdin,
                                expectedOutput: submissions[i].expected_output,
                                actualOutput: result.stdout,
                                error: result.stderr || result.compile_output,
                            },
                            details: result,
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // ✅ Save problem to DB (only after validation passes)
        const problem = await (prisma as unknown as PrismaClient).problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                hint,
                editor,
                testCases,
                codeSnippet,
                referenceSolution,
                userId: user.id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Problem created successfully",
                data: problem,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating problem:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
