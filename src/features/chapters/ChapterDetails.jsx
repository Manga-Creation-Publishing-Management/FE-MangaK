import { useState } from 'react';
import { ArrowLeft, Check, X, MessageSquare, Send } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { StatusBadge } from '@/features/series/StatusBadge';

export function ChapterDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { seriesId, chapterId } = useParams();
  const [chapterStatus, setChapterStatus] = useState('processing');
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([
    { id: 1, author: 'Tantou Editor', message: 'Great work on the action scenes! Please adjust the panel flow on page 12.', date: '2026-05-15' },
  ]);

  const chapter = {
    id: chapterId,
    seriesId: seriesId,
    title: 'Chapter 3: First Battle',
    seriesName: 'The Last Warrior',
    pages: 32,
    uploadDate: '2026-05-10',
  };

  const role = location.pathname.includes('mangaka') ? 'mangaka' :
               location.pathname.includes('tantou') ? 'tantou' : 'editorial';

  const handleTantouApprove = () => {
    if (feedback.trim()) {
      setFeedbackList([
        ...feedbackList,
        {
          id: feedbackList.length + 1,
          author: 'Tantou Editor',
          message: feedback,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    console.log('Tantou Editor approves - Submitting to Editorial Board');
    setChapterStatus('need-review');
    setFeedback('');
  };

  const handleTantouReject = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback before rejecting');
      return;
    }
    setFeedbackList([
      ...feedbackList,
      {
        id: feedbackList.length + 1,
        author: 'Tantou Editor',
        message: feedback,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    console.log('Tantou Editor rejects - Feedback:', feedback);
    console.log('Status changed to: Rejected - Sent back to Mangaka');
    setChapterStatus('rejected');
    setFeedback('');
  };

  const handleEditorialApprove = () => {
    if (feedback.trim()) {
      setFeedbackList([
        ...feedbackList,
        {
          id: feedbackList.length + 1,
          author: 'Editorial Board',
          message: feedback,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    console.log('Editorial Board approves chapter');
    setChapterStatus('approved');
    setFeedback('');
  };

  const handleEditorialReject = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback before rejecting');
      return;
    }
    setFeedbackList([
      ...feedbackList,
      {
        id: feedbackList.length + 1,
        author: 'Editorial Board',
        message: feedback,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    console.log('Editorial Board rejects - Feedback:', feedback);
    console.log('Status changed to: Rejected - Sent back to Tantou Editor');
    setChapterStatus('rejected');
    setFeedback('');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      const authorName = role === 'mangaka' ? 'Mangaka' :
                        role === 'tantou' ? 'Tantou Editor' : 'Editorial Board';
      setFeedbackList([
        ...feedbackList,
        {
          id: feedbackList.length + 1,
          author: authorName,
          message: feedback,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setFeedback('');
      console.log('Feedback submitted');
    }
  };

  const showTantouActions = role === 'tantou' && chapterStatus === 'processing';
  const showEditorialActions = role === 'editorial' && chapterStatus === 'processing';

  return (
    <div className="p-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Series
      </button>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1>{chapter.title}</h1>
            <p className="text-muted-foreground mt-1">{chapter.seriesName}</p>
          </div>
          <StatusBadge status={chapterStatus} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Pages</p>
            <p className="text-xl mt-1">{chapter.pages}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Upload Date</p>
            <p className="text-xl mt-1">{chapter.uploadDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Feedback Count</p>
            <p className="text-xl mt-1">{feedbackList.length}</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-8">
          <p className="text-center text-muted-foreground">Chapter preview would appear here</p>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-background rounded-lg border border-border" />
            ))}
          </div>
        </div>

        {showTantouActions && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="text-sm text-muted-foreground">Feedback (Optional for approval, Required for rejection)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the mangaka..."
                className="w-full mt-2 px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleTantouApprove}
                className="flex items-center gap-2 px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Check size={18} />
                Submit to Editorial Board
              </button>
              <button
                onClick={handleTantouReject}
                className="flex items-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <X size={18} />
                Reject & Send to Mangaka
              </button>
            </div>
          </div>
        )}

        {showEditorialActions && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="text-sm text-muted-foreground">Feedback (Optional for approval, Required for rejection)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the Tantou Editor and Mangaka..."
                className="w-full mt-2 px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEditorialApprove}
                className="flex items-center gap-2 px-6 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Check size={18} />
                Approve Chapter
              </button>
              <button
                onClick={handleEditorialReject}
                className="flex items-center gap-2 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <X size={18} />
                Reject & Send Feedback
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          <h2>Feedback</h2>
        </div>

        <div className="space-y-4">
          {feedbackList.map((item) => (
            <div key={item.id} className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{item.author}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
              <p className="text-sm">{item.message}</p>
            </div>
          ))}
        </div>

        {!showTantouActions && !showEditorialActions && chapterStatus !== 'approved' && (
          <form onSubmit={handleSubmitFeedback} className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback..."
              className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Send size={18} />
                Send Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
