import { useState } from 'react';
import {
  Home, FolderKanban, DollarSign, TrendingUp, Settings,
  CalendarClock, CheckSquare, ClipboardList, FileSearch, BookMarked,
  Menu, Upload
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Logo } from '../../shared/components/Logo';

export function Sidebar({ userRole }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = {
    reader: [
      { icon: Home, label: 'Dashboard', path: '/reader', key: 'dashboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/reader/profile', key: 'profile' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin', key: 'dashboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/admin/profile', key: 'profile' },
    ],
    mangaka: [
      { icon: Home, label: 'Dashboard', path: '/mangaka', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Management', path: '/mangaka/series', key: 'series' },
      { icon: ClipboardList, label: 'Task Management', path: '/mangaka/tasks', key: 'tasks' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/mangaka/tracking', key: 'tracking' },
      { icon: Settings, label: 'Profile & Settings', path: '/mangaka/profile', key: 'profile' },
    ],
    assistant: [
      { icon: Home, label: 'Dashboard', path: '/assistant', key: 'dashboard' },
      { icon: CheckSquare, label: 'My Tasks', path: '/assistant/tasks', key: 'tasks' },
      { icon: DollarSign, label: 'Income', path: '/assistant/income', key: 'income' },
      { icon: Settings, label: 'Profile & Settings', path: '/assistant/profile', key: 'profile' },
    ],
    tantouEditor: [
      { icon: Home, label: 'Dashboard', path: '/tantouEditor', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Review', path: '/tantouEditor/series', key: 'series' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/tantouEditor/tracking', key: 'tracking' },
      { icon: Settings, label: 'Profile & Settings', path: '/tantouEditor/profile', key: 'profile' },
    ],
    editorialBoard: [
      { icon: Home, label: 'Dashboard', path: '/editorialBoard', key: 'dashboard' },
      { icon: FileSearch, label: 'Series Approval', path: '/editorialBoard/series', key: 'series' },
      { icon: CalendarClock, label: 'Publishing Schedule', path: '/editorialBoard/schedule', key: 'schedule' },
      { icon: Upload, label: 'Rating Data Import', path: '/editorialBoard/voting', key: 'voting' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/editorialBoard/tracking', key: 'tracking' },
      { icon: Settings, label: 'Profile & Settings', path: '/editorialBoard/profile', key: 'profile' },
    ],
  };

  const items = menuItems[userRole] ?? [];

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border h-screen p-4 transition-all duration-300 relative flex flex-col ${isOpen ? 'w-64' : 'w-20'
        }`}
    >
      <div className={`flex items-center mb-6 ${isOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
        <Logo size="sm" showText={isOpen} to={`/${userRole}`} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border transition-colors shrink-0"
          title={isOpen ? "Đóng sidebar" : "Mở sidebar"}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === 'dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors unique-sidebar-item ${isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
                } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {isOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}