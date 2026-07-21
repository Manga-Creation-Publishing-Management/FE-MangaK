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
  const displayRole = roleDisplayNames[roleName] || roleName;
  const { showAlert } = useToast();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {roleName !== 'reader' && <Sidebar userRole={roleName} className="" />}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        <HeaderPage roleName={displayRole} avatarUrl="/avatarImgDemo.png" />
        {pageHeader && (
          <div className="p-6 m-4 bg-card border border-border rounded-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{pageHeader.title}</h1>
                <p className="text-muted-foreground">{pageHeader.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {pageHeader.actions}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-1 bg-background">
          <Outlet context={{ setPageHeader }} />
        </div>
      </main>
    </div>
  );
}
