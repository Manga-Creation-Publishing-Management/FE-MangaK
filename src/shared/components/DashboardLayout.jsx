import { Sidebar } from '@/shared/components/Sidebar';
import { Header } from '@/shared/components/Header';

export function DashboardLayout({ role, children }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
