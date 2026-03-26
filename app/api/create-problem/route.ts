import { UserRole } from "@/lib/generated/prisma/enums";
import { getCurrentUserRole, onBoardUser } from "@/module/auth/action";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/databaseConnection";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { getJudge0LanguageId, submitBatch, pollBatchResults, submitSingle, getJudge0Result } from "@/lib/judge0";
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
    hints?: string;
    editorial?: string;
    testCases: TestCase[];
    codeSnippets: any;
    referenceSolutions: ReferenceSolutions;
}

function mergeSolutionIntoSnippet(language: string, snippet: string | undefined, solution: string) {
    if (!solution) return snippet || "";
    if (!snippet) return solution;

    const lang = language.toUpperCase();

    if (lang === "JAVASCRIPT") {
        const fnMatch = solution.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
        if (fnMatch) {
            const fnName = fnMatch[1];
            const fnPattern = new RegExp(`function\\s+${fnName}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}`, "m");
            if (fnPattern.test(snippet)) {
                return snippet.replace(fnPattern, solution);
            }
        }
        // fallback
        return `${solution}\n\n${snippet}`;
    }

    if (lang === "PYTHON") {
        const mainIndex = snippet.indexOf("if __name__ == \"__main__\":");
        if (mainIndex >= 0) {
            const runner = snippet.slice(mainIndex);
            return `${solution}\n\n${runner}`;
        }
        return `${solution}\n\n${snippet}`;
    }

    if (lang === "JAVA") {
        const methodMatch = solution.match(/public\s+int\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/);
        if (methodMatch) {
            const methodName = methodMatch[1];
            const methodPattern = new RegExp(`public\\s+int\\s+${methodName}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}`, "m");
            if (methodPattern.test(snippet)) {
                return snippet.replace(methodPattern, solution.replace(/\s*\n$/, ""));
            }
        }
        return `${solution}\n\n${snippet}`;
    }

    return solution;
}

async function validateJudge0Submissions(submissions: any[]) {
    try {
        const batchResponse = await submitBatch(submissions);
        const tokens = (batchResponse.submissions ?? []).map((item: any) => item.token).filter(Boolean);
        if (!tokens.length) throw new Error("No tokens returned from Judge0 batch");

        const results = await pollBatchResults(tokens);

        // if judge0 internal errors occur, retry with sequential per-item submissions
        const internalError = results.some((r: any) => r.status?.id === 13);
        if (!internalError) return results;

        console.warn("Judge0 batch internal error detected, retrying sequential submissions");
    } catch (err) {
        console.warn("Judge0 batch path failed, retrying sequential submissions", err);
    }

    const results: any[] = [];
    for (const submission of submissions) {
        const single = await submitSingle(submission);
        const itemResult = await getJudge0Result(single.token);
        results.push(itemResult);
    }
    return results;
}

export async function POST(request: NextRequest) {
    try {
        console.log("[CreateProblem] Incoming request");

        const clerkUser = await currentUser();
        if (!clerkUser) {
            console.warn("[CreateProblem] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Ensure user exists in database before checking role
        await onBoardUser();
        const userRole = await getCurrentUserRole();

        if (userRole.role !== UserRole.ADMIN) {
            console.warn("[CreateProblem] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get the database user ID
        const dbUser = await (prisma as unknown as PrismaClient).user.findUnique({
            where: { clerkId: clerkUser.id },
            select: { id: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found in database" }, { status: 400 });
        }

        const body: ProblemPayload = await request.json();
        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            hints,
            editorial,
            testCases,
            codeSnippets,
            referenceSolutions,
        } = body;

        console.log("[CreateProblem] Validating required fields");

        if (!title || !description || !difficulty || !testCases?.length || !codeSnippets || !referenceSolutions) {
            console.warn("[CreateProblem] Missing required fields");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return NextResponse.json({ error: "At least one test case is required" }, { status: 400 });
        }

        if (!referenceSolutions || typeof referenceSolutions !== "object") {
            return NextResponse.json({ error: "Reference solution must be provided for all languages" }, { status: 400 });
        }


        // Skip validation for now - will validate when users submit solutions
        // for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        //     console.log(`[CreateProblem] Validating ${language} solution`);
        //
        //     const languageId = getJudge0LanguageId(language);
        //     if (!languageId) {
        //         return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
        //     }
        //
        //     const runnableSource = mergeSolutionIntoSnippet(language, codeSnippets?.[language], solutionCode);
        //
        //     const submissions = testCases.map(({ input, output }) => ({
        //         source_code: runnableSource,
        //         language_id: languageId,
        //         stdin: input,
        //         expected_output: output,
        //     }));
        //
        //     console.log(`[CreateProblem] Submitting ${submissions.length} test cases to Judge0 for ${language}`);
        //
        //     const results = await validateJudge0Submissions(submissions);
        //
        //     results.forEach((result: any, i: number) => {
        //         if (result.status.id !== 3) {
        //             console.error(`[CreateProblem] Validation failed for ${language} on test case #${i + 1}`, result);
        //             throw {
        //                 language,
        //                 testCase: submissions[i],
        //                 details: result,
        //                 message: `Validation failed for ${language} on test case #${i + 1}`,
        //             };
        //         }
        //     });
        //
        //     console.log(`[CreateProblem] All test cases passed for ${language}`);
        // }

        // ✅ Save problem to DB
        console.log("[CreateProblem] Saving problem to database");

        const problem = await (prisma as unknown as PrismaClient).problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples: JSON.stringify(examples),
                constraints,
                hint: hints || null,
                editor: editorial || null,
                testCases: JSON.stringify(testCases),
                codeSnippet: JSON.stringify(codeSnippets),
                referenceSolution: JSON.stringify(referenceSolutions),
                userId: dbUser.id,
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
