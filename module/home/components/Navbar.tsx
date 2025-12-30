import ModeToggle from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { UserRole } from "@/lib/generated/prisma/enums";

interface NavbarProps {
    userRole: UserRole | null;
}

function Navbar({ userRole }: NavbarProps) {
    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
            <div className="bg-black/80 backdrop-blur-md border border-orange-500/20 rounded-2xl shadow-lg shadow-orange-500/10 transition-all duration-200 hover:bg-black/90">
                <div className="px-6 py-4 flex justify-between items-center">
                    <Link href={"/"} className="flex items-center gap-2">
                        {/* <Image src={"/logo.svg"} alt="TreeBio" width={42} height={42} /> */}
                        <span className="font-bold text-2xl tracking-widest bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            Problem Pit
                        </span>
                    </Link>

                    <div className="flex flex-row items-center justify-center gap-x-4">
                        <Link
                            href="/problems"
                            className="text-sm font-medium text-gray-300 hover:text-orange-400 cursor-pointer transition-colors"
                        >
                            Problems
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-300 hover:text-orange-400 cursor-pointer transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/profile"
                            className="text-sm font-medium text-gray-300 hover:text-orange-400 cursor-pointer transition-colors"
                        >
                            Profile
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <SignedIn>
                            {userRole && userRole === UserRole.ADMIN && (
                                <Link href={"/create-problem"}>
                                    <Button variant={"outline"} size={"default"}>
                                        Create Problem
                                    </Button>
                                </Link>
                            )}
                            <UserButton />
                        </SignedIn>

                        <SignedOut>
                            <div className="flex items-center gap-2">
                                <SignInButton>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-sm font-medium hover:bg-orange-500/20 text-gray-300 hover:text-orange-400"
                                    >
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton>
                                    <Button
                                        size="sm"
                                        className="text-sm font-medium bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                                    >
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
