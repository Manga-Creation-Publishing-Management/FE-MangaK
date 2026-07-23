import { useState } from 'react';
import {
  Home, FolderKanban, DollarSign, TrendingUp, CalendarClock,
  CheckSquare, ClipboardList, FileSearch, Users, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Logo } from '@/shared/components/Logo';
import { Mascot } from '@/shared/components/Mascot';

export function Sidebar({ userRole, isMobileOpen, onCloseMobile }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = {
    reader: [
      { icon: Home, label: 'Dashboard', path: '/reader', key: 'dashboard' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin', key: 'dashboard' },
      { icon: Users, label: 'Account Management', path: '/admin/accounts', key: 'accounts' },
    ],
    mangaka: [
      { icon: Home, label: 'Dashboard', path: '/mangaka', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Management', path: '/mangaka/series', key: 'series' },
      { icon: ClipboardList, label: 'Task Management', path: '/mangaka/tasks', key: 'tasks' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/mangaka/leaderboard', key: 'leaderboard' },
    ],
    assistant: [
      { icon: Home, label: 'Dashboard', path: '/assistant', key: 'dashboard' },
      { icon: CheckSquare, label: 'My Tasks', path: '/assistant/tasks', key: 'tasks' },
      { icon: DollarSign, label: 'Income', path: '/assistant/income', key: 'income' },
    ],
    tantou: [
      { icon: Home, label: 'Dashboard', path: '/tantou', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Review', path: '/tantou/series', key: 'series' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/tantou/leaderboard', key: 'leaderboard' },
    ],
    editorial: [
      { icon: Home, label: 'Dashboard', path: '/editorial', key: 'dashboard' },
      { icon: FileSearch, label: 'Series Approval', path: '/editorial/series', key: 'series' },
      { icon: CalendarClock, label: 'Publishing Schedule', path: '/editorial/schedule', key: 'schedule' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/editorial/leaderboard', key: 'leaderboard' },
    ],
  };

  const items = menuItems[userRole] ?? [];

  const renderNavItems = (isCollapsed = false) => (
    <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
      {items.map((item) => {
        const Icon = item.icon;
        const cleanPath = location.pathname.replace(/\/$/, "");
        const cleanItemPath = item.path.replace(/\/$/, "");
        const isActive = item.key === 'dashboard'
          ? cleanPath === cleanItemPath
          : (item.key === 'series' && location.pathname.includes('/chapter/'))
            ? true
            : cleanPath.startsWith(cleanItemPath);

        return (
          <Link
            key={item.key}
            to={item.path}
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex items-center gap-3 px-3 py-2.5 transition-colors unique-sidebar-item ${isActive
              ? 'unique-sidebar-item-active'
              : 'text-sidebar-foreground hover:bg-sidebar-accent rounded-md'
              } ${isCollapsed && 'justify-center'}`}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon size={20} className="shrink-0" />
            {!isCollapsed && <span className="truncate text-sm">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] md:hidden transition-opacity"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-sidebar p-4 manga-sidebar flex flex-col transition-transform duration-300 md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-sidebar-border">
          <Logo size="md" showText={true} to={`/${userRole}`} />
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border transition-colors shrink-0 toggle-btn"
            title="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        {renderNavItems(false)}
        <div className="mt-auto shrink-0">
          <Mascot userRole={userRole} isMobile={true} isMobileOpen={isMobileOpen} />
        </div>
      </div>

      <div
        className={`hidden md:flex bg-sidebar manga-sidebar h-screen p-4 transition-all duration-300 relative z-10 flex-col shrink-0 ${isOpen ? 'w-60' : 'w-20'
          }`}
      >
        <div className={`flex items-center mb-6 ${isOpen ? 'justify-start px-1' : 'justify-center'}`}>
          <Logo size="md" showText={isOpen} to={`/${userRole}`} />
        </div>
        {renderNavItems(!isOpen)}

        <div className="mt-auto shrink-0">
          <Mascot userRole={userRole} isOpen={isOpen} />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 -translate-y-1/2 right-0 z-20 w-6 h-10 p-0 text-sidebar-foreground hover:bg-sidebar-accent transition-colors shrink-0 toggle-btn"
          title={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </>
  );
}
