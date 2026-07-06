export function GenreFilterTags({ categories, selectedCategory, onCategorySelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex gap-2.5 overflow-x-auto pb-2 shrink-0 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-20 rounded-full bg-card border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full overflow-hidden">
      <span className="text-sm font-semibold text-muted-foreground shrink-0 hidden md:inline">
        Genres:
      </span>
      <div className="flex gap-2.5 overflow-x-auto pb-2 shrink-0 w-full no-scrollbar select-none">
        {/* Nút lọc tất cả (All) */}
        <button
          onClick={() => onCategorySelect("all")}
          className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 shrink-0 ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground"
          }`}
        >
          All
        </button>

        {/* Danh sách các thể loại */}
        {categories.map((category) => {
          const isSelected = selectedCategory === String(category.categoryId);
          return (
            <button
              key={category.categoryId}
              onClick={() => onCategorySelect(String(category.categoryId))}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {category.categoryName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
