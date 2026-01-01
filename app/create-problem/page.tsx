import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/mode-toggle";
import CreateProblemForm from "@/module/problems/components/CreateProblemForm";

function CreateProblem() {
    return (
        <section className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b px-6 py-4">
                <div className="grid grid-cols-[auto_1fr_auto] items-center max-w-7xl mx-auto">
                    {/* Left */}
                    <Link href="/">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>

                    {/* Center */}
                    <h1 className="text-center text-3xl font-bold bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Problem Pit
                    </h1>

                    {/* Right */}
                    <ModeToggle />
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center px-6">
               <CreateProblemForm />
            </main>
        </section>
    );
}

export default CreateProblem;
