import { useState } from 'react';
import { ArrowLeft, Plus, Check, X, Send, Users } from 'lucide-react';
import { useNavigate, useParams, useLocation, Link } from 'react-router';
import { StatusBadge } from '@/features/series/StatusBadge';
import { AddChapterModal } from '@/features/chapters/AddChapterModal';

export function SeriesDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [showAddChapter, setShowAddChapter] = useState(false);

  // Determine initial status based on series ID
  const getInitialStatus = () => {
    if (id === '1') return 'approved';
    if (id === '2') return 'processing';
    return 'rejected';
  };

  const [seriesStatus, setSeriesStatus] = useState(getInitialStatus());
  const [feedback, setFeedback] = useState('');
  const [publicationSchedule, setPublicationSchedule] = useState('weekly');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const role = location.pathname.includes('mangaka') ? 'mangaka' :
               location.pathname.includes('tantou') ? 'tantou' : 'editorial';

  const seriesData = {
    '1': {
      id: '1',
      name: 'The Last Warrior',
      author: 'Akira Tanaka',
      description: 'A young warrior embarks on a quest to save his kingdom from an ancient evil.',
      genres: ['Action', 'Fantasy', 'Adventure'],
      language: 'English',
      coverColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    '2': {
      id: '2',
      name: 'Moonlight Chronicles',
      author: 'Yuki Sato',
      description: 'A mystical tale set under the moonlight, where secrets unfold and destinies intertwine.',
      genres: ['Romance', 'Fantasy', 'Mystery'],
      language: 'English',
      coverColor: 'bg-gradient-to-br from-orange-400 to-pink-500',
    },
    '3': {
      id: '3',
      name: 'Dark Academia',
      author: 'Hiro Yamada',
      description: 'Students at an elite academy uncover dark secrets hidden within ancient walls.',
      genres: ['Mystery', 'Thriller', 'Drama'],
      language: 'English',
      coverColor: 'bg-gradient-to-br from-indigo-400 to-purple-500',
    },
  };

  const series = seriesData[id || '1'] || seriesData['1'];

  // Only approved series have chapters
  const chapters = seriesStatus === 'approved' ? [
    { id: 1, title: 'Chapter 1: The Beginning', pages: 24, status: 'approved', uploadDate: '2026-04-15' },
    { id: 2, title: 'Chapter 2: The Journey Starts', pages: 28, status: 'approved', uploadDate: '2026-04-22' },
    { id: 3, title: 'Chapter 3: First Battle', pages: 32, status: 'processing', uploadDate: '2026-05-10' },
  ] : [];

  const handleTantouApprove = () => {
    console.log('Phase 1: Tantou Editor approves names/draft - Submitting to Editorial Board');
    setSeriesStatus('need-review');
    setFeedback('');
  };

  const handleTantouReject = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback before rejecting');
      return;
    }
    console.log('Phase 1: Tantou Editor rejects names/draft - Feedback:', feedback);
    console.log('Status changed to: Rejected - Sent back to Mangaka to revise names');
    setSeriesStatus('rejected');
    setFeedback('');
  };

  const handleEditorialApprove = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleSet = () => {
    console.log('Phase 1 Complete: Editorial Board approves with schedule:', publicationSchedule, 'starting:', startDate);
    console.log('Status changed to: Approved - Mangaka can now start Phase 2 (Production)');
    console.log('Mangaka can now: Create chapters, Assign tasks to assistants');
    setSeriesStatus('approved');
    setShowScheduleModal(false);
  };

  const handleEditorialReject = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback before rejecting');
      return;
    }
    console.log('Phase 1: Editorial Board rejects names/draft - Feedback:', feedback);
    console.log('Status changed to: Rejected - Sent back to Mangaka');
    setSeriesStatus('rejected');
    setFeedback('');
  };

  const canAddChapters = seriesStatus === 'approved' && role === 'mangaka';
  const showTantouActions = role === 'tantou' && seriesStatus === 'processing';
  const showEditorialActions = role === 'editorial' && (seriesStatus === 'need-review' || seriesStatus === 'processing');
  const canReviewChapters = role === 'tantou' || role === 'editorial';

  return (
    <div className="p-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className={`h-64 ${series.coverColor}`} />
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1>{series.name}</h1>
              {role !== 'mangaka' && <p className="text-muted-foreground mt-1">by {series.author}</p>}
            </div>
            <StatusBadge status={seriesStatus} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Language</p>
              <p className="mt-1">{series.language}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Genres</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {series.genres.map((genre) => (
                  <span key={genre} className="px-3 py-1 bg-muted rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-1">{series.description}</p>
          </div>

          {showTantouActions && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-sm text-info">
                  <strong>Phase 1: Initial Names Submission Review</strong><br />
                  Review the draft/names (outline) submitted by the Mangaka. This is the initial concept approval before production begins.
                </p>
              </div>
              <div>
                <label htmlFor="tantou-feedback" className="text-sm text-muted-foreground">Feedback on Names/Draft (Optional for approval, Required for rejection)</label>
                <textarea
                  id="tantou-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback on the series concept and draft..."
                  className="w-full mt-2 px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTantouApprove}
                  className="flex items-center gap-2 px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Check size={18} />
                  Approve Names & Submit to Editorial Board
                </button>
                <button
                  onClick={handleTantouReject}
                  className="flex items-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <X size={18} />
                  Reject Names & Send Feedback
                </button>
              </div>
            </div>
          )}

          {showEditorialActions && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-sm text-info">
                  <strong>Phase 1: {seriesStatus === 'processing' ? 'Initial' : 'Final'} Review & Approval</strong><br />
                  {seriesStatus === 'processing'
                    ? 'Review the series concept submitted by the Mangaka. Make your approval decision and set the publication schedule.'
                    : 'Make the final decision on the series concept. If approved, set the publication schedule (weekly/monthly) to begin Phase 2 production.'}
                </p>
              </div>
              <div>
                <label htmlFor="editorial-feedback" className="text-sm text-muted-foreground">Feedback on Names/Draft (Optional for approval, Required for rejection)</label>
                <textarea
                  id="editorial-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback on the series concept..."
                  className="w-full mt-2 px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEditorialApprove}
                  className="flex items-center gap-2 px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Check size={18} />
                  Approve Series & Set Schedule
                </button>
                <button
                  onClick={handleEditorialReject}
                  className="flex items-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <X size={18} />
                  Reject Series & Send Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {seriesStatus === 'approved' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2>Chapters ({chapters.length})</h2>
              {canReviewChapters && (
                <p className="text-sm text-muted-foreground mt-1">Click on chapters to review and approve/reject individually</p>
              )}
            </div>
            <div className="flex gap-3">
              {role === 'mangaka' && seriesStatus === 'approved' && (
                <>
                  <Link
                    to={`/${role}/series/${id}/tasks`}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Users size={20} />
                    Manage Tasks
                  </Link>
                  <button
                    onClick={() => setShowAddChapter(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus size={20} />
                    Add New Chapter
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3>{chapter.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{chapter.pages} pages</p>
                    <p className="text-sm text-muted-foreground">Uploaded: {chapter.uploadDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={chapter.status} />
                    <Link
                      to={`/${role}/series/${id}/chapter/${chapter.id}`}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {canReviewChapters && chapter.status === 'processing' ? 'Review Chapter' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!canAddChapters && role === 'mangaka' && (
        <>
          {seriesStatus === 'processing' && (
            <div className="bg-info/10 border border-info/30 rounded-lg p-6">
              <p className="text-info text-sm">Names/Draft is awaiting Tantou Editor review. You will be notified once reviewed.</p>
            </div>
          )}

          {seriesStatus === 'rejected' && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                <p className="text-destructive font-medium mb-1">Series Rejected</p>
                <p className="text-sm text-muted-foreground">This series was not approved. See feedback below.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2>Rejection Feedback</h2>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">Tantou Editor</p>
                      <p className="text-sm text-muted-foreground">2026-05-14</p>
                    </div>
                    <p className="text-sm">The draft concept lacks originality and the character designs are too similar to existing licensed works. Please revise the main character's visual identity and strengthen the core story premise before resubmitting.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <AddChapterModal isOpen={showAddChapter} onClose={() => setShowAddChapter(false)} seriesName={series.name} />

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-8 w-full max-w-md">
            <h2 className="mb-6">Set Publication Schedule</h2>
            <div className="space-y-6 mb-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Frequency</p>
                <button
                  onClick={() => setPublicationSchedule('weekly')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    publicationSchedule === 'weekly' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <p className="font-medium">Weekly</p>
                  <p className="text-sm text-muted-foreground">New chapter every week</p>
                </button>
                <button
                  onClick={() => setPublicationSchedule('monthly')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    publicationSchedule === 'monthly' ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <p className="font-medium">Monthly</p>
                  <p className="text-sm text-muted-foreground">New chapter every month</p>
                </button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSet}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Approve Series
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
