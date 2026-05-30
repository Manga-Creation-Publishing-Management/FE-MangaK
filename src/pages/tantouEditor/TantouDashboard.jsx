import { BookOpen, MessageSquare, CheckCircle, Mail, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge } from '@/features/series/StatusBadge';

export function TantouDashboard() {
  const feedbacks = [
    { id: 1, from: 'Editorial Board', series: 'The Last Warrior', message: 'Series performance is excellent. Continue current strategy.', date: '2026-05-17', unread: true },
    { id: 2, from: 'Editorial Board', series: 'Moonlight Chronicles', message: 'Please review the pacing of recent chapters.', date: '2026-05-15', unread: false },
  ];

  const series = [
    { id: 1, name: 'The Last Warrior', author: 'Akira Tanaka', chapters: 24, status: 'approved', pendingFeedback: 2 },
    { id: 2, name: 'Moonlight Chronicles', author: 'Yuki Sato', chapters: 12, status: 'need-review', pendingFeedback: 5 },
    { id: 3, name: 'Dark Academia', author: 'Hiro Yamada', chapters: 8, status: 'processing', pendingFeedback: 1 },
  ];

  const stats = [
    { label: 'Assigned Series', value: '3', icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Pending Feedback', value: '8', icon: MessageSquare, color: 'bg-accent/10 text-accent' },
    { label: 'Approved This Month', value: '15', icon: CheckCircle, color: 'bg-success/10 text-success' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Tantou Editor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Review and manage assigned series</p>
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
        <h2>Assigned Series</h2>
      </div>

      <div className="space-y-4">
        {series.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3>{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-muted-foreground">{item.chapters} Chapters</span>
                  <span className="text-sm text-accent">{item.pendingFeedback} Pending Feedback</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={item.status} />
                <Link
                  to={`/tantou/series/${item.id}`}
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
              <p className="text-sm text-muted-foreground mb-1">Re: {feedback.series}</p>
              <p className="text-sm">{feedback.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
