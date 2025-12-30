import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b flex items-center justify-center">
      <div className="text-center">
        <UserButton />
      </div>
    </div>
  );
}