import Navbar from "@/module/home/components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
        <Navbar userRole="ADMIN" />
        <div className="flex-1 flex-col pb-4 px-4">
            {children}
        </div>
    </main>
  )
}

export default RootLayout