import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        {children}
    </main>
);

export default AuthLayout;
