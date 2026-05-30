import { Home, FolderKanban, DollarSign, TrendingUp, Upload, Settings, CalendarClock, CheckSquare, ClipboardList, FileSearch, Users, ShieldCheck, BookMarked } from 'lucide-react';
import { Link, useLocation } from 'react-router';


export function Sidebar({ userRole }) {
  const location = useLocation();

  const menuItems = {
    reader: [
      { icon: Home, label: 'Dashboard', path: '/reader', key: 'dashboard' },
      { icon: BookMarked, label: 'Browse Series', path: '/reader', key: 'browse' },
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
    tantou: [
      { icon: Home, label: 'Dashboard', path: '/tantou', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Review', path: '/tantou/series', key: 'series' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/tantou/tracking', key: 'tracking' },
      { icon: Settings, label: 'Profile & Settings', path: '/tantou/profile', key: 'profile' },
    ],
    editorial: [
      { icon: Home, label: 'Dashboard', path: '/editorial', key: 'dashboard' },
      { icon: FileSearch, label: 'Series Approval', path: '/editorial/series', key: 'series' },
      { icon: CalendarClock, label: 'Publishing Schedule', path: '/editorial/schedule', key: 'schedule' },
      { icon: Upload, label: 'Rating Data Import', path: '/editorial/voting', key: 'voting' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/editorial/tracking', key: 'tracking' },
      { icon: Settings, label: 'Profile & Settings', path: '/editorial/profile', key: 'profile' },
    ],
  };

  const items = menuItems[userRole] ?? [];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen p-4">
      <div className="mb-8">
        <h1 className="text-primary px-3 mb-2">MangaK</h1>
        <p className="text-sm text-muted-foreground px-3 capitalize">{userRole} Portal</p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
