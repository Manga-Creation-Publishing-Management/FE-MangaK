import { useState } from 'react';
import { X, Upload } from 'lucide-react';


export function CreateSeriesModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    seriesName: '',
    authorName: '',
    language: 'English',
    genres: [],
    description: '',
  });

  const genres = ['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Horror', 'Mystery', 'Slice of Life'];

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating series (names/draft):', formData);
    console.log('Phase 1: Initial Names Submission');
    console.log('Status automatically set to: Processing - Awaiting Tantou Editor review');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <h2>Create New Series</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="seriesName">Series Name</label>
            <input
              id="seriesName"
              type="text"
              value={formData.seriesName}
              onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter series name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="authorName">Author Name</label>
            <input
              id="authorName"
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>English</option>
              <option>Japanese</option>
              <option>Korean</option>
              <option>Chinese</option>
              <option>Spanish</option>
            </select>
          </div>

          <div className="space-y-2">
            <label>Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.genres.includes(genre)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
              placeholder="Enter series description"
              required
            />
          </div>

          <div className="space-y-2">
            <label>Upload Cover Page</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          <div className="space-y-2">
            <label>Upload Story Name</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">PDF, ZIP up to 50MB</p>
              <input type="file" accept=".pdf,.zip" className="hidden" />
            </div>
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
