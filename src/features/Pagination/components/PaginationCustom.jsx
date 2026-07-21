import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPaginationRange } from "../hooks/getPaginationRange";

export function PaginationCustom({currentPage, totalPages, setCurrentPage} ) {
  return (
    <>
      <div className="flex justify-center items-center gap-2 mt-8 select-none">
        {/* Nút Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1.5 border border-border bg-card text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm font-medium hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Render các nút số trang kèm dấu ba chấm (Không dùng return) */}
        {getPaginationRange(currentPage, totalPages).map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-muted-foreground font-medium">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 border border-border rounded-lg text-sm font-medium cursor-pointer transition-colors ${currentPage === page
                ? "bg-primary text-primary-foreground border-primary"
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
          className="px-3 py-1.5 border border-border bg-card text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm font-medium hover:bg-muted transition-colors"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </>
  )
}