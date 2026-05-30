import { useState } from 'react';
import { Search, Star, ChevronDown, BookOpen, X, Check } from 'lucide-react';

const allSeries = [
  {
    id: 1,
    name: 'The Last Warrior',
    author: 'Kenji Tanaka',
    genre: 'Action / Fantasy',
    coverColor: 'bg-gradient-to-br from-purple-500 to-purple-700',
    chapters: [
      { id: 1, title: 'Chapter 1 – The Awakening' },
      { id: 2, title: 'Chapter 2 – Into the Unknown' },
      { id: 3, title: 'Chapter 3 – The First Battle' },
      { id: 4, title: 'Chapter 4 – Dark Resolve' },
    ],
    rating: 4.7,
    ratingCount: 1240,
  },
  {
    id: 2,
    name: 'Moonlight Chronicles',
    author: 'Aoi Suzuki',
    genre: 'Romance / Slice of Life',
    coverColor: 'bg-gradient-to-br from-orange-400 to-pink-500',
    chapters: [
      { id: 1, title: 'Chapter 1 – First Light' },
      { id: 2, title: 'Chapter 2 – Stargazers' },
      { id: 3, title: 'Chapter 3 – Midnight Promise' },
    ],
    rating: 4.5,
    ratingCount: 875,
  },
  {
    id: 3,
    name: 'Dark Academia',
    author: 'Hiro Nakamura',
    genre: 'Mystery / Thriller',
    coverColor: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    chapters: [
      { id: 1, title: 'Chapter 1 – Enrollment' },
      { id: 2, title: 'Chapter 2 – The Cipher' },
    ],
    rating: 4.2,
    ratingCount: 530,
  },
  {
    id: 4,
    name: 'Iron Forge',
    author: 'Ren Yamada',
    genre: 'Sci-Fi / Mecha',
    coverColor: 'bg-gradient-to-br from-slate-500 to-cyan-600',
    chapters: [
      { id: 1, title: 'Chapter 1 – Ignition' },
      { id: 2, title: 'Chapter 2 – Overload' },
      { id: 3, title: 'Chapter 3 – Breach' },
      { id: 4, title: 'Chapter 4 – Resonance' },
      { id: 5, title: 'Chapter 5 – War Machine' },
    ],
    rating: 4.8,
    ratingCount: 2100,
  },
  {
    id: 5,
    name: 'Crimson Petal',
    author: 'Yuki Hayashi',
    genre: 'Drama / Historical',
    coverColor: 'bg-gradient-to-br from-red-400 to-rose-600',
    chapters: [
      { id: 1, title: 'Chapter 1 – Bloom' },
      { id: 2, title: 'Chapter 2 – Frost' },
      { id: 3, title: 'Chapter 3 – Withering' },
    ],
    rating: 4.3,
    ratingCount: 690,
  },
  {
    id: 6,
    name: 'Stormbound',
    author: 'Makoto Abe',
    genre: 'Adventure / Supernatural',
    coverColor: 'bg-gradient-to-br from-teal-400 to-emerald-600',
    chapters: [
      { id: 1, title: 'Chapter 1 – Eye of the Storm' },
      { id: 2, title: 'Chapter 2 – Undertow' },
    ],
    rating: 4.0,
    ratingCount: 320,
  },
];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReaderDashboard() {
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [chapterOpen, setChapterOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const filtered = allSeries.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSeries = (s) => {
    setSelectedSeries(s);
    setSelectedChapterId(null);
    setRating(0);
    setSubmitted(false);
    setChapterOpen(false);
    setQuery(s.name);
  };

  const handleSubmitRating = () => {
    if (!selectedSeries || !selectedChapterId || rating === 0) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedSeries(null);
    setSelectedChapterId(null);
    setRating(0);
    setSubmitted(false);
    setQuery('');
  };

  const selectedChapter = selectedSeries?.chapters.find((c) => c.id === selectedChapterId);

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1>Reader Dashboard</h1>
        <p className="text-muted-foreground mt-1">Search for a series and rate your favourite chapters</p>
      </div>

      {/* Search & Rating Panel */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5 max-w-2xl">
        <h2 className="text-base font-medium">Find & Rate a Chapter</h2>

        {/* Search input */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedSeries && e.target.value !== selectedSeries.name) {
                setSelectedSeries(null);
                setSelectedChapterId(null);
                setRating(0);
                setSubmitted(false);
              }
            }}
            placeholder="Search series by name…"
            className="w-full pl-10 pr-10 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
          {query && (
            <button
              onClick={handleReset}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {/* Autocomplete dropdown */}
          {query && !selectedSeries && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSeries(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 text-left transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${s.coverColor} flex-shrink-0`} />
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.genre}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chapter selector */}
        {selectedSeries && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${selectedSeries.coverColor} flex-shrink-0`} />
              <div>
                <p className="font-medium">{selectedSeries.name}</p>
                <p className="text-sm text-muted-foreground">{selectedSeries.genre} · {selectedSeries.author}</p>
              </div>
            </div>

            {/* Chapter dropdown */}
            <div className="relative">
              <button
                onClick={() => setChapterOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-input-background border border-border rounded-xl hover:border-primary/50 transition-colors"
              >
                <span className={selectedChapterId ? '' : 'text-muted-foreground'}>
                  {selectedChapter ? selectedChapter.title : 'Select a chapter…'}
                </span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${chapterOpen ? 'rotate-180' : ''}`} />
              </button>
              {chapterOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
                  {selectedSeries.chapters.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => { setSelectedChapterId(ch.id); setChapterOpen(false); setRating(0); setSubmitted(false); }}
                      className="w-full px-4 py-2.5 text-left hover:bg-primary/5 text-sm transition-colors"
                    >
                      {ch.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            {selectedChapterId && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Rate this chapter:</p>
                <StarRating value={rating} onChange={setRating} />
                {submitted ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                    <Check size={16} />
                    <span>Thanks! Your rating has been submitted.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmitRating}
                    disabled={rating === 0}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl transition-opacity disabled:opacity-40 hover:enabled:opacity-90 text-sm font-medium"
                  >
                    Submit Rating
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Browse all series */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Browse All Series</h2>
          <span className="text-sm text-muted-foreground">{allSeries.length} series available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allSeries.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectSeries(s)}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all text-left group"
            >
              <div className={`h-32 ${s.coverColor} relative`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <BookOpen size={48} className="text-white" />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <span>{s.rating}</span>
                  <span className="text-white/70">({s.ratingCount.toLocaleString()})</span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium group-hover:text-primary transition-colors">{s.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s.genre}</span>
                  <span className="text-xs text-muted-foreground">{s.chapters.length} chapters</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
