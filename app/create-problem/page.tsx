import { Button } from '@/components/ui/button';
import ModeToggle from '@/components/ui/mode-toggle';
import CreateProblemForm from '@/modules/problems/components/create-problem-form';
import { currentUser } from '@clerk/nextjs/server'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const CreateProblemPage = async () => {
    const user = await currentUser();
    return (
        <section className='flex flex-col items-center container mx-4 my-4 min-h-screen'>
            <div className='flex flex-row justify-between items-center w-full mb-6'>
                <Link href={"/"}>
                    <Button variant={"outline"} size={"icon"}>
                        <ArrowLeft className='size-4' />
                    </Button>
                </Link>

                <h1 className='text-3xl font-bold text-amber-400'>Welcome {user?.firstName}! Create a Problem</h1>
                <ModeToggle />
            </div>
            <div className="w-full max-w-5xl">
                <CreateProblemForm />
            </div>
        </section>
    )
}

export default CreateProblemPage
