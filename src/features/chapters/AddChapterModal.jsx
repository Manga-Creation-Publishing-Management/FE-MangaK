import { useState } from 'react';
import { X, Upload, FileImage } from 'lucide-react';


export function AddChapterModal({ isOpen, onClose, seriesName }) {
  const [formData, setFormData] = useState({
    title: '',
  });

  const [uploadedPages, setUploadedPages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Phase 2: Mangaka creates chapter manuscript:', formData);
    console.log('Status automatically set to: Processing');
    console.log('Next: Assign tasks to Assistants for this chapter');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <div>
            <h2>Add New Chapter</h2>
            <p className="text-sm text-muted-foreground mt-1">{seriesName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title">Chapter Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Chapter 1: The Beginning"
              required
            />
          </div>

          <div className="space-y-2">
            <label>Upload Comic Work File / Images</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">PNG, JPG, PSD - Multiple files supported</p>
              <input
                type="file"
                accept="image/*,.psd"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setUploadedPages(files.map(f => f.name));
                }}
              />
            </div>
          </div>

          {uploadedPages.length > 0 && (
            <div className="space-y-2">
              <label>Preview of Chapter Pages ({uploadedPages.length} files)</label>
              <div className="grid grid-cols-4 gap-4">
                {uploadedPages.map((page, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-muted/50">
                    <FileImage className="mx-auto mb-2 text-muted-foreground" size={32} />
                    <p className="text-xs text-center truncate">{page}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <p className="text-sm text-info">
              Status will be automatically set to <strong>Processing</strong> after creation
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
