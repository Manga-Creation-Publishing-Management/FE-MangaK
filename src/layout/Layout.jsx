import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { HeaderPage } from './HeaderPage';
import { useEffect, useState } from 'react';
import { useToast } from '@/shared/hooks/useToast';

const roleDisplayNames = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  admin: "Admin",
  reader: "Reader"
};

export function Layout({ roleName }) {
  const [pageHeader, setPageHeader] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const displayRole = roleDisplayNames[roleName] || roleName;
  const { showAlert } = useToast();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {roleName !== 'reader' && (
        <Sidebar
          userRole={roleName}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      )}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background min-w-0">
        <HeaderPage
          roleName={displayRole}
          avatarUrl="/avatarImgDemo.png"
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        />
        {pageHeader && (
          <div className="p-4 sm:p-6 m-3 sm:m-4 bg-card border border-border rounded-2xl shrink-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold manga-title">{pageHeader.title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{pageHeader.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {pageHeader.actions}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-background">
          <Outlet context={{ setPageHeader }} />
        </div>
      </main>
    </div>
  );
}
