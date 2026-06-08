import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { StatusBadge } from '@/features/series/StatusBadge';
import { Link } from 'react-router';
import { WelcomeLine } from '../shared/WelcomeLine';
import { seriesService } from '../../services/seriesService';
import { updateSeries } from '../../services/updateSeriesService';

export function EditorialDashboard() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState('');
  const [approvedSeries, setApprovedSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovedSeries = async () => {
    try {
      const response = await seriesService.getAllSeries();
      const allSeries = response.data || [];
      const filtered = allSeries.filter(s =>
        s.status?.toLowerCase() === 'approved' || s.status?.toLowerCase() === 'publishing'
      );
      const mapped = filtered.map(s => ({
        id: s.seriesId,
        name: s.title,
        author: s.mangakaName,
        chapters: s.totalChapters || 0,
        status: s.status?.toLowerCase()
      }));
      setApprovedSeries(mapped);
    } catch (error) {
      console.error('Failed to fetch approved series:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedSeries();
  }, []);

  const handleCancelClick = (item) => {
    setSelectedSeries(item);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelFeedback.trim()) {
      alert('Please provide feedback for cancellation');
      return;
    }
    try {
      await updateSeries.updateToApprove(selectedSeries.id, {
        isApproved: false,
        note: cancelFeedback
      });
      alert('Series has been cancelled successfully.');
      setShowCancelModal(false);
      setCancelFeedback('');
      setSelectedSeries(null);
      fetchApprovedSeries();
    } catch (error) {
      console.error('Failed to cancel series:', error);
      alert(error.message || 'Failed to cancel series. Please try again.');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <WelcomeLine roleName="Editorial Board" />

      <div>
        <h2>Approved Series</h2>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Loading approved series...</p>
        ) : approvedSeries.length === 0 ? (
          <p className="text-muted-foreground">No approved series currently in publication.</p>
        ) : (
          approvedSeries.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3>{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.chapters} Chapters</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  <button
                    onClick={() => handleCancelClick(item)}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel Series
                  </button>
                  <Link
                    to={`/editorialBoard/series/${item.id}`}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-8 w-full max-w-md">
            <h2 className="mb-4">Cancel Series</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to cancel <strong>{selectedSeries?.name}</strong>? This action requires feedback.
            </p>
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">
                Cancellation Feedback (Required)
              </label>
              <textarea
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                placeholder="Explain why this series is being cancelled..."
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelFeedback('');
                  setSelectedSeries(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
