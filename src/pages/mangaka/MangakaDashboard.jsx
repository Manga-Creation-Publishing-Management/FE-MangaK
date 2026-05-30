import { useState } from 'react';
import { Plus, BookOpen, Mail, AlertCircle } from 'lucide-react';
import { CreateSeriesModal } from '@/features/series/CreateSeriesModal';
import { AddChapterModal } from '@/features/chapters/AddChapterModal';
import { StatusBadge } from '@/features/series/StatusBadge';
import { Link } from 'react-router';

export function MangakaDashboard() {
  const [showCreateSeries, setShowCreateSeries] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState('');

  const feedbacks = [
    { id: 1, from: 'Tantou Editor', series: 'Dark Academia', message: 'Great progress on Chapter 8! Please adjust the panel flow on page 12.', date: '2026-05-16', unread: true },
    { id: 2, from: 'Editorial Board', series: 'Moonlight Chronicles', message: 'Series approved! Please maintain weekly publication schedule.', date: '2026-05-15', unread: false },
  ];

  const series = [
    { id: 1, name: 'The Last Warrior', chapters: 24, status: 'approved', coverColor: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { id: 2, name: 'Moonlight Chronicles', chapters: 12, status: 'processing', coverColor: 'bg-gradient-to-br from-orange-400 to-pink-500' },
    { id: 3, name: 'Dark Academia', chapters: 8, status: 'rejected', coverColor: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
  ];

  const stats = [
    { label: 'Total Series', value: '3', icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Total Chapters', value: '44', icon: BookOpen, color: 'bg-accent/10 text-accent' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Mangaka Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
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

      <div className="flex justify-between items-center">
        <h2>My Series</h2>
        <button
          onClick={() => setShowCreateSeries(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Create New Series
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {series.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-48 ${item.coverColor}`} />
            <div className="p-6 space-y-4">
              <div>
                <h3>{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.chapters} Chapters</p>
              </div>
              <StatusBadge status={item.status} />
              <div className="flex gap-2 pt-2">
                <Link
                  to={`/mangaka/series/${item.id}`}
                  className="flex-1 text-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  View Details
                </Link>
                {item.status === 'approved' && (
                  <button
                    onClick={() => {
                      setSelectedSeries(item.name);
                      setShowAddChapter(true);
                    }}
                    className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Add Chapter
                  </button>
                )}
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

      <CreateSeriesModal isOpen={showCreateSeries} onClose={() => setShowCreateSeries(false)} />
      <AddChapterModal isOpen={showAddChapter} onClose={() => setShowAddChapter(false)} seriesName={selectedSeries} />
    </div>
  );
}
