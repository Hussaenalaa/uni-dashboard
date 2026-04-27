import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

// AuthProvider is already in the root layout — no need to wrap again here
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="p-4 bg-gray-50 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
