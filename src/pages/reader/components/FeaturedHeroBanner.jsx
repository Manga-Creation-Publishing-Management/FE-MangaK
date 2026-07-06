import { BookOpen, Sparkles } from "lucide-react";

export function FeaturedHeroBanner({ featuredSeries, isLoading, onNavigateToDetail }) {
  if (isLoading) {
    return (
      <div className="w-full h-[360px] rounded-2xl bg-card animate-pulse border border-border flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading Spotlight...</p>
      </div>
    );
  }

  if (!featuredSeries) {
    return null;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden h-[360px] bg-slate-950 shadow-xl border border-border/10 group">
      {/* Background Image with Blur & Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={featuredSeries.coverFile}
          alt={featuredSeries.title}
          className="w-full h-full object-cover opacity-35 scale-105 group-hover:scale-100 transition-transform duration-700 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider bg-primary/10 w-fit px-3 py-1.5 rounded-full border border-primary/20">
          <Sparkles size={14} />
          Spotlight Series
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          {featuredSeries.title}
        </h1>

        <p className="text-slate-300 text-sm md:text-base font-medium drop-shadow">
          by {featuredSeries.mangakaName || "Unknown Artist"}
        </p>

        <p className="text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed max-w-lg">
          {featuredSeries.description || "Enter the world of adventure and discover this amazing story. New chapters uploaded weekly!"}
        </p>

        <div className="pt-2 flex gap-4">
          <button
            onClick={() => onNavigateToDetail(featuredSeries.seriesId || featuredSeries.id)}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg text-sm"
          >
            <BookOpen size={18} />
            Read Now
          </button>
        </div>
      </div>
    </div>
  );
}
