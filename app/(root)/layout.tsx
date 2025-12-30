import { getCurrentUserRole } from "@/module/auth/action";
import Navbar from "@/module/home/components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

async function RootLayout({ children }: RootLayoutProps) {
  const userRole = await getCurrentUserRole();
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar userRole={userRole.role}/>
        <div className="flex-1 flex-col">
            {children}
        </div>
    </main>
  )
}

export default RootLayout