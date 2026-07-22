import { Link, useLocation } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

const roleNames = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  admin: "Admin",
  reader: "Reader"
};

const routeLabels = {
  series: "Series Management",
  chapter: "Chapter List",
  tasks: "Task Management",
  income: "Income",
  leaderboard: "Leaderboard",
  accounts: "Accounts",
  profile: "Profile"
};

export function Breadcrumb({ items, className = "" }) {
  const location = useLocation();

  let breadcrumbItems = items;

  // Auto-generate items if not explicitly provided
  if (!breadcrumbItems) {
    const segments = location.pathname.split('/').filter(Boolean);
    const role = segments[0] || "mangaka";
    const roleTitle = roleNames[role] || "Dashboard";

    breadcrumbItems = [
      { label: roleTitle, path: `/${role}` }
    ];

    if (segments.length > 1) {
      const parentSection = segments[1];
      const parentLabel = routeLabels[parentSection] || parentSection.charAt(0).toUpperCase() + parentSection.slice(1);
      
      // If it's a detail route with an ID (e.g. /mangaka/series/123)
      if (segments.length > 2) {
        breadcrumbItems.push({ label: parentLabel, path: `/${role}/${parentSection}` });
        if (parentSection === 'series') {
          breadcrumbItems.push({ label: 'Series Detail' });
        } else if (parentSection === 'chapter') {
          breadcrumbItems.push({ label: 'Chapter Detail' });
        } else if (parentSection === 'tasks') {
          breadcrumbItems.push({ label: 'Task Detail' });
        } else {
          breadcrumbItems.push({ label: 'Detail' });
        }
      } else {
        breadcrumbItems.push({ label: parentLabel });
      }
    }
  }

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`sticky top-0 z-10 flex items-center flex-wrap gap-2 text-sm text-muted-foreground bg-card/90 backdrop-blur-md border border-border px-4 py-2.5 rounded-xl shadow-xs mb-6 ${className}`}
    >
      <Link 
        to={breadcrumbItems[0]?.path || "/"} 
        className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
      >
        <Home size={16} className="shrink-0" />
        <span>{breadcrumbItems[0]?.label}</span>
      </Link>

      {breadcrumbItems.slice(1).map((item, index) => {
        const isLast = index === breadcrumbItems.length - 2;
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-muted-foreground/60 shrink-0" />
            {item.path && !isLast ? (
              <Link 
                to={item.path} 
                className="hover:text-primary transition-colors font-medium truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground truncate max-w-[240px]">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
