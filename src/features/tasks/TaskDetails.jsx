import { useState } from 'react';
import { Download, Upload, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/features/series/StatusBadge';
import { useNavigate, useParams } from 'react-router';

export function TaskDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [uploadedFile, setUploadedFile] = useState(null);

  const task = {
    id: id,
    title: 'Lineart - Chapter 24',
    seriesName: 'The Last Warrior',
    chapterNumber: 24,
    pageRange: 'Pages 1-8',
    status: 'processing',
    dueDate: '2026-05-22',
    manuscriptFile: 'chapter-24-manuscript-draft.pdf',
    description: 'Create clean lineart for pages 1-8 based on the provided manuscript. Pay attention to line weight variation and character expressions.',
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFinish = () => {
    console.log('Phase 2: Assistant completes task with file:', uploadedFile);
    console.log('Task status automatically changed to: Need to Review (Awaiting Mangaka approval)');
    navigate('/assistant');
  };

  return (
    <div className="p-8 space-y-8">
      <button
        onClick={() => navigate('/assistant/tasks')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Tasks
      </button>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1>{task.title}</h1>
            <p className="text-muted-foreground mt-1">Task #{task.id}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Series Name</p>
              <p className="mt-1">{task.seriesName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chapter Number</p>
              <p className="mt-1">Chapter {task.chapterNumber}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Page Range</p>
              <p className="mt-1">{task.pageRange}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="mt-1">{task.dueDate}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="mt-1">{task.description}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Manuscript File (Draft from Mangaka)</h2>
        <p className="text-sm text-muted-foreground">Download the manuscript draft to work on your assigned pages</p>
        <div className="bg-muted/50 border border-border rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Download className="text-primary" size={24} />
            </div>
            <div>
              <p>{task.manuscriptFile}</p>
              <p className="text-sm text-muted-foreground">24.5 MB • {task.pageRange}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Upload Submit File</h2>
        <p className="text-muted-foreground">Upload your completed work for review</p>

        {!uploadedFile ? (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">PSD, PNG, JPG up to 100MB</p>
            <input
              type="file"
              accept=".psd,image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Choose File
            </label>
          </div>
        ) : (
          <div className="bg-success/10 border border-success/30 rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Upload className="text-success" size={24} />
              </div>
              <div>
                <p>{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handleFinish}
            disabled={!uploadedFile}
            className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
