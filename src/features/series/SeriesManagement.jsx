import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateSeriesModal } from '@/features/series/CreateSeriesModal';
import { StatusBadge } from '@/features/series/StatusBadge';
import { Link, useLocation } from 'react-router';

export function SeriesManagement() {
  const location = useLocation();
  const [showCreateSeries, setShowCreateSeries] = useState(false);

  const role = location.pathname.includes('mangaka') ? 'mangaka' :
               location.pathname.includes('tantou') ? 'tantou' : 'editorial';

  const allSeries = [
    { id: 1, name: 'The Last Warrior', author: 'Akira Tanaka', chapters: 24, status: 'approved', coverColor: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { id: 2, name: 'Moonlight Chronicles', author: 'Yuki Sato', chapters: 12, status: 'processing', coverColor: 'bg-gradient-to-br from-orange-400 to-pink-500' },
    { id: 3, name: 'Dark Academia', author: 'Hiro Yamada', chapters: 8, status: 'processing', coverColor: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
  ];

  const series = role === 'editorial'
    ? allSeries.filter(s => s.status === 'processing')
    : allSeries;

  const pageTitle = role === 'editorial' ? 'Series Approval' : 'Series Management';
  const pageDesc = role === 'mangaka' ? 'Manage your series and chapters'
    : role === 'tantou' ? 'Review and approve series for Editorial Board'
    : 'Review and approve series pending editorial decision';

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1>{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">{pageDesc}</p>
        </div>
        {role === 'mangaka' && (
          <button
            onClick={() => setShowCreateSeries(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Create New Series
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {series.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-48 ${item.coverColor}`} />
            <div className="p-6 space-y-4">
              <div>
                <h3>{item.name}</h3>
                {role !== 'mangaka' && <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>}
                <p className="text-sm text-muted-foreground mt-1">{item.chapters} Chapters</p>
              </div>
              <StatusBadge status={item.status} />
              <Link
                to={`/${role}/series/${item.id}`}
                className="block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <CreateSeriesModal isOpen={showCreateSeries} onClose={() => setShowCreateSeries(false)} />
    </div>
  );
}
