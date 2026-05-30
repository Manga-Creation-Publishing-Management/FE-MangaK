import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { StatusBadge } from '@/features/series/StatusBadge';

export function ChapterPublishing() {
  const navigate = useNavigate();
  const { seriesId, chapterId } = useParams();
  const [publishStatus, setPublishStatus] = useState('ready');

  const chapter = {
    id: chapterId,
    seriesId: seriesId,
    title: 'Chapter 24: The Final Battle',
    seriesName: 'The Last Warrior',
    pages: 32,
    completedTasks: 4,
    totalTasks: 4,
  };

  const tasks = [
    { id: 1, role: 'Lineart', assignee: 'John Doe', status: 'approved' },
    { id: 2, role: 'Base Color', assignee: 'Jane Smith', status: 'approved' },
    { id: 3, role: 'Shading', assignee: 'Mike Johnson', status: 'approved' },
    { id: 4, role: 'Typography', assignee: 'Sarah Lee', status: 'approved' },
  ];

  const handleSubmitForPublishing = () => {
    console.log('Phase 2: Mangaka submits chapter to Tantou Editor for publishing');
    console.log('Chapter:', chapter.title);
    setPublishStatus('submitted');
  };

  return (
    <div className="p-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1>{chapter.title}</h1>
            <p className="text-muted-foreground mt-1">{chapter.seriesName}</p>
          </div>
          {publishStatus === 'submitted' ? (
            <span className="px-4 py-2 bg-success/10 text-success border border-success/30 rounded-full">
              Submitted for Publishing
            </span>
          ) : (
            <span className="px-4 py-2 bg-info/10 text-info border border-info/30 rounded-full">
              Ready to Submit
            </span>
          )}
        </div>

        <div className="bg-info/10 border border-info/30 rounded-lg p-4">
          <p className="text-sm text-info">
            <strong>Phase 2: Production Status</strong><br />
            All assistant tasks have been completed and approved. You can now submit this chapter to Tantou Editor for publishing.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Pages</p>
            <p className="text-xl mt-1">{chapter.pages}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Tasks</p>
            <p className="text-xl mt-1">{chapter.completedTasks}/{chapter.totalTasks}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-xl mt-1 text-success">100%</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Assistant Tasks Status</h2>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-success" size={24} />
                <div>
                  <p className="font-medium">{task.role}</p>
                  <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                </div>
              </div>
              <StatusBadge status={task.status} />
            </div>
          ))}
        </div>
      </div>

      {publishStatus !== 'submitted' && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmitForPublishing}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Send size={20} />
            Submit to Tantou Editor for Publishing
          </button>
        </div>
      )}

      {publishStatus === 'submitted' && (
        <div className="bg-success/10 border border-success/30 rounded-lg p-6 text-center">
          <CheckCircle className="mx-auto mb-3 text-success" size={48} />
          <h3 className="text-success">Chapter Submitted Successfully!</h3>
          <p className="text-muted-foreground mt-2">
            This chapter has been sent to Tantou Editor for final review and publishing.
          </p>
        </div>
      )}
    </div>
  );
}
