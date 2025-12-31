import { getCurrentUserRole } from "@/module/auth/action";
import Navbar from "@/module/home/components/Navbar";
import { currentUser } from "@clerk/nextjs/server";

interface RootLayoutProps {
  children: React.ReactNode;
}

async function RootLayout({ children }: RootLayoutProps) {
  const user = await currentUser();
  let userRole = null;

  if (user) {
    try {
      userRole = await getCurrentUserRole();
    } catch (error) {
      console.error("Error fetching user role:", error);
      userRole = null;
    }
  }

  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar userRole={userRole?.role || null} />
      <div className="flex-1 flex-col">
        {children}
      </div>
    </main>
  )
}

export default RootLayout