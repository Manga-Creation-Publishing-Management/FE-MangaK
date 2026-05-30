import { CheckCircle, Clock, AlertCircle, Mail } from 'lucide-react';
import { StatusBadge } from '@/features/series/StatusBadge';
import { Link } from 'react-router';

export function AssistantTasks() {
  const feedbacks = [
    { id: 1, from: 'Tantou Editor', task: 'Lineart - Chapter 24', message: 'Excellent linework! Approved.', date: '2026-05-17', unread: true },
    { id: 2, from: 'Mangaka Tanaka', task: 'Base Color - Chapter 12', message: 'Please adjust the color tone for the night scenes.', date: '2026-05-16', unread: false },
  ];

  const tasks = [
    { id: 1, title: 'Lineart - Chapter 24', series: 'The Last Warrior', pageRange: 'Pages 1-8', status: 'processing', dueDate: '2026-05-22' },
    { id: 2, title: 'Base Color - Chapter 12', series: 'Moonlight Chronicles', pageRange: 'Pages 9-16', status: 'need-review', dueDate: '2026-05-20' },
    { id: 3, title: 'Shading - Chapter 8', series: 'Dark Academia', pageRange: 'Pages 1-24', status: 'approved', dueDate: '2026-05-18' },
    { id: 4, title: 'Typography - Chapter 25', series: 'The Last Warrior', pageRange: 'Pages 17-32', status: 'processing', dueDate: '2026-05-25' },
    { id: 5, title: 'Lineart - Chapter 13', series: 'Moonlight Chronicles', pageRange: 'Pages 1-12', status: 'need-review', dueDate: '2026-05-21' },
  ];

  const stats = [
    { label: 'Completed', value: '24', icon: CheckCircle, color: 'bg-success/10 text-success' },
    { label: 'In Progress', value: '8', icon: Clock, color: 'bg-info/10 text-info' },
    { label: 'Pending Review', value: '3', icon: AlertCircle, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>My Tasks</h1>
        <p className="text-muted-foreground mt-1">Manage your assigned tasks</p>
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

      <div>
        <h2>Active Tasks</h2>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3>{task.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{task.series} • {task.pageRange}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={task.status} />
                <Link
                  to={`/assistant/tasks/${task.id}`}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="text-primary" size={24} />
          <h2>Feedback Mailbox</h2>
          {feedbacks.filter(f => f.unread).length > 0 && (
            <span className="px-2 py-1 bg-destructive text-destructive-foreground rounded-full text-xs">
              {feedbacks.filter(f => f.unread).length} new
            </span>
          )}
        </div>

        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className={`p-4 border rounded-lg ${
                feedback.unread ? 'bg-primary/5 border-primary/30' : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {feedback.unread && <AlertCircle className="text-primary" size={16} />}
                  <p className="font-medium">{feedback.from}</p>
                </div>
                <span className="text-sm text-muted-foreground">{feedback.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Re: {feedback.task}</p>
              <p className="text-sm">{feedback.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
