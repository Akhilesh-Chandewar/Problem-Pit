import { UserRole } from "@/lib/generated/prisma/enums";
import { getCurrentUserRole } from "@/module/auth/action";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/databaseConnection";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "@/lib/judge0";
import { ProblemDifficulty } from "@/lib/generated/prisma/client";

interface TestCase {
    input: string;
    output: string;
}

interface ReferenceSolutions {
    [language: string]: string;
}

interface ProblemPayload {
    title: string;
    description: string;
    difficulty: ProblemDifficulty;
    tags: string[];
    examples: any;
    constraints: string;
    hint?: string;
    editor?: string;
    testCases: TestCase[];
    codeSnippet: any;
    referenceSolution: ReferenceSolutions;
}

export async function POST(request: NextRequest) {
    try {
        console.log("[CreateProblem] Incoming request");

        const userRole = await getCurrentUserRole();
        const user = await currentUser();

        if (!user || userRole.role !== UserRole.ADMIN) {
            console.warn("[CreateProblem] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body: ProblemPayload = await request.json();
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

        console.log("[CreateProblem] Validating required fields");

        if (!title || !description || !difficulty || !testCases?.length || !codeSnippet || !referenceSolution) {
            console.warn("[CreateProblem] Missing required fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return NextResponse.json({ error: "At least one test case is required" }, { status: 400 });
        }

        if (!referenceSolution || typeof referenceSolution !== "object") {
            return NextResponse.json({ error: "Reference solution must be provided for all languages" }, { status: 400 });
        }

        // ✅ Validate reference solutions via Judge0
        for (const [language, solutionCode] of Object.entries(referenceSolution)) {
            console.log(`[CreateProblem] Validating ${language} solution`);

            const languageId = getJudge0LanguageId(language);
            if (!languageId) {
                return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
            }

            const submissions = testCases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            console.log(`[CreateProblem] Submitting ${submissions.length} test cases to Judge0 for ${language}`);

            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res: any) => res.token);
            const results = await pollBatchResults(tokens);

            results.forEach((result: any, i: number) => {
                if (result.status.id !== 3) {
                    console.error(`[CreateProblem] Validation failed for ${language} on test case #${i + 1}`, result);
                    throw {
                        language,
                        testCase: submissions[i],
                        details: result,
                        message: `Validation failed for ${language} on test case #${i + 1}`,
                    };
                }
            });

            console.log(`[CreateProblem] All test cases passed for ${language}`);
        }

        // ✅ Save problem to DB
        console.log("[CreateProblem] Saving problem to database");

        const problem = await (prisma as unknown as PrismaClient).problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples: JSON.stringify(examples),         // <-- stringify
                constraints,
                hint: hint || null,
                editor: editor || null,
                testCases: JSON.stringify(testCases),       // <-- stringify
                codeSnippet,
                referenceSolution: JSON.stringify(referenceSolution), // <-- stringify
                userId: user.id,
            },
        });

        console.log("[CreateProblem] Problem saved successfully:", problem.id);

        return NextResponse.json(
            { success: true, message: "Problem created successfully", data: problem },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("[CreateProblem] Error:", err);

        if (err?.message) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
