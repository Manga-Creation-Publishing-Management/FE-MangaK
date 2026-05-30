import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge } from '@/features/series/StatusBadge';

export function AssistantDashboard() {
  const stats = [
    { label: 'Active Tasks', value: '6', icon: Clock, color: 'bg-info/10 text-info' },
    { label: 'Completed Tasks', value: '24', icon: CheckCircle, color: 'bg-success/10 text-success' },
    { label: 'Pending Review', value: '3', icon: AlertCircle, color: 'bg-warning/10 text-warning' },
  ];

  const recentTasks = [
    { id: 1, title: 'Lineart — Pages 1–12', chapter: 'Chapter 24', status: 'processing', deadline: '2026-05-25' },
    { id: 2, title: 'Base Color — Pages 13–24', chapter: 'Chapter 23', status: 'approved', deadline: '2026-05-18' },
    { id: 3, title: 'Shading — Pages 1–16', chapter: 'Chapter 8', status: 'processing', deadline: '2026-05-27' },
    { id: 4, title: 'Typography — Pages 20–28', chapter: 'Chapter 12', status: 'need-review', deadline: '2026-05-22' },
    { id: 5, title: 'Lineart — Pages 5–18', chapter: 'Chapter 25', status: 'approved', deadline: '2026-05-20' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Assistant Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your tasks and progress</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-2xl mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2>Recent Tasks</h2>
          <Link
            to="/assistant/tasks"
            className="text-sm text-primary hover:underline"
          >
            View All Tasks ?
          </Link>
        </div>

        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{task.chapter}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">Due {task.deadline}</p>
                <StatusBadge status={task.status} />
                <Link
                  to={`/assistant/tasks/${task.id}`}
                  className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
