import { onBoardUser } from "@/module/auth/action";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  await onBoardUser();
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <UserButton />
        <h1 className="mt-6 text-4xl font-bold text-gray-800">Welcome to the App!</h1>
        <p className="mt-4 text-lg text-gray-600">
          This is your personalized dashboard.
        </p>
      </div>
    </div>
  );
}