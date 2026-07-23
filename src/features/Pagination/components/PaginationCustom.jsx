import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPaginationRange } from "../hooks/getPaginationRange";

export function PaginationCustom({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 select-none max-w-full px-1">
      {/* Nút Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border bg-card text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm font-medium hover:bg-muted transition-colors shrink-0"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Render các nút số trang kèm dấu ba chấm */}
      {getPaginationRange(currentPage, totalPages).map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground font-medium shrink-0">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => setCurrentPage(page)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-colors shrink-0 ${currentPage === page
              ? "bg-primary text-primary-foreground border-primary font-bold"
              : "bg-card text-foreground hover:bg-muted"
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* Nút Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className="px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border bg-card text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm font-medium hover:bg-muted transition-colors shrink-0"
      >
        <ArrowRight size={16} />
      </button>
    </div>
  );
}