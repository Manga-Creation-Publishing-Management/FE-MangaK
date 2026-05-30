import { useState } from 'react';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { StatusBadge } from '@/features/series/StatusBadge';

export function TaskManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    chapterNumber: '',
    assignee: '',
    pageRange: '',
    description: '',
  });

  const tasks = [
    { id: 1, title: 'Task - Chapter 24', chapter: 24, assignee: 'John Doe', pageRange: 'Pages 1-8', status: 'processing' },
    { id: 2, title: 'Task - Chapter 24', chapter: 24, assignee: 'Jane Smith', pageRange: 'Pages 9-16', status: 'need-review' },
    { id: 3, title: 'Task - Chapter 23', chapter: 23, assignee: 'Mike Johnson', pageRange: 'Pages 1-24', status: 'approved' },
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    console.log('Creating task:', taskForm);
    console.log('Task status automatically set to: Processing');
    setShowCreateTask(false);
    setTaskForm({ chapterNumber: '', assignee: '', pageRange: '', description: '' });
  };

  return (
    <div className="p-8 space-y-8">
      {id && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Series
        </button>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1>Task Management</h1>
          <p className="text-muted-foreground mt-1">Assign tasks to assistants</p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Create New Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3>{task.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Chapter {task.chapter} • {task.pageRange}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-muted-foreground">Assigned to: {task.assignee}</span>
                </div>
              </div>
              <StatusBadge status={task.status} />
            </div>
          </div>
        ))}
      </div>

      {showCreateTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
              <h2>Create New Task</h2>
              <button onClick={() => setShowCreateTask(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="chapterNumber">Chapter Number</label>
                <input
                  id="chapterNumber"
                  type="number"
                  value={taskForm.chapterNumber}
                  onChange={(e) => setTaskForm({ ...taskForm, chapterNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 24"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="pageRange">Page Range</label>
                <input
                  id="pageRange"
                  type="text"
                  value={taskForm.pageRange}
                  onChange={(e) => setTaskForm({ ...taskForm, pageRange: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Pages 1-8"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="assignee">Assign to Assistant</label>
                <select
                  id="assignee"
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select assistant</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description">Task Description</label>
                <textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
                  placeholder="Describe the task requirements..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Upload Manuscript File (Draft)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
                  <p className="text-muted-foreground">Click to upload manuscript draft</p>
                  <p className="text-sm text-muted-foreground mt-1">PSD, PDF, PNG, JPG up to 100MB</p>
                  <input type="file" accept=".psd,.pdf,image/*" className="hidden" />
                </div>
              </div>

              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-sm text-info">
                  Task status will be automatically set to <strong>Processing</strong> after creation
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
