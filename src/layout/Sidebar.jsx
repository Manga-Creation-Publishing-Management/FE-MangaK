import { useState } from 'react';
import {
  Home, FolderKanban, DollarSign, TrendingUp,
  CalendarClock, CheckSquare, ClipboardList, FileSearch, BookMarked,
  Menu, Upload, Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Logo } from '@/shared/components/Logo';

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
    <nav className="space-y-1 flex-1">
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors unique-sidebar-item ${isActive
              ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
              : 'text-sidebar-foreground hover:bg-sidebar-accent'
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
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar p-4 border-r border-sidebar-border flex flex-col transition-transform duration-300 md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-sidebar-border">
          <Logo size="sm" showText={true} to={`/${userRole}`} />
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border transition-colors shrink-0"
            title="Close menu"
          >
            <Menu size={20} />
          </button>
        </div>
        {renderNavItems(false)}
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex bg-sidebar border-r border-sidebar-border h-screen p-4 transition-all duration-300 relative flex-col shrink-0 ${
          isOpen ? 'w-60' : 'w-20'
        }`}
      >
        <div className={`flex items-center mb-6 ${isOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
          <Logo size="sm" showText={isOpen} to={`/${userRole}`} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border transition-colors shrink-0"
            title={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={20} />
          </button>
        </div>
        {renderNavItems(!isOpen)}
      </div>
    </>
  );
}
