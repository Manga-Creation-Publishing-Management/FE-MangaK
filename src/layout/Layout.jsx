import { Outlet } from 'react-router';
import { Sidebar } from '@/layout/Sidebar';
import { HeaderPage } from '@/layout/HeaderPage';
import { useState } from 'react';
import { Breadcrumb } from '@/shared/components/Breadcrumb';

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
  const [breadcrumbItems, setBreadcrumbItems] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const displayRole = roleDisplayNames[roleName] || roleName;

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
        {breadcrumbItems && (
          <Breadcrumb items={breadcrumbItems} />
        )}
        {pageHeader && (
          <div className="p-4 sm:p-6 m-3 sm:m-4 bg-card border border-border rounded-2xl shrink-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{pageHeader.title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{pageHeader.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {pageHeader.actions}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-background">
          <Outlet context={{ setPageHeader, setBreadcrumbItems }} />
        </div>
      </main>
    </div>
  );
}
