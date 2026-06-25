import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Undo, Brush, Type } from "lucide-react";
import { KonvaDraw } from "./KonvaDraw";
import { useChapterAnnotation } from "../../features/chapters/hooks/useChapterAnnotation";

// Kích hoạt Web Worker để thư viện react-pdf xử lý PDF ở một luồng độc lập
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function AnnotationModal({ isOpen, onClose, chapterFileUrl }) {
  const {
    tool,
    setTool,
    annotationData,
    annotationText,
    textInput,
    setTextInput,
    brushColor,
    setBrushColor,
    pageNumber,
    setPageNumber,
    pageWidth,
    pageHeight,
    isPageLoaded,
    setIsPageLoaded,
    numPages,
    handleUndo,
    handleClearPage,
    setPageLines,
    setPageTexts,
    closeModal,
    handleBackdropClick,
    onPageLoadSuccess,
    onDocumentLoadSuccess,
    handleSubmitAnnotation,
  } = useChapterAnnotation(onClose);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-[95vw] max-h-[95vh] overflow-y-auto flex flex-col items-center gap-4 relative">

        {/* Tiêu đề & Nút Close */}
        <div className="flex justify-between items-center w-full pb-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">View and Annotate</h2>
          <button
            onClick={closeModal}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* MỚI NỮA NÈ: Thanh công cụ: Vẽ và Text */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full bg-muted/40 p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            {/* Các nút chọn công cụ vẽ/text */}
            <button
              onClick={() => setTool('brush')}
              className={`p-2 rounded-lg transition-all ${tool === 'brush' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              title="Brush"
            >
              <Brush />
            </button>
            <button
              onClick={() => setTool('text')}
              className={`p-2 rounded-lg transition-all ${tool === 'text' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              title="Text"
            >
              <Type />
            </button>
          </div>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text..."
            className="px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Thanh công cụ vẽ: Brush color, Undo, Clear */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full bg-muted/40 p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color:</span>
            <div className="flex gap-1.5">
              {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#000000"].map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${brushColor === color ? 'border-primary scale-110 shadow-sm' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUndo(pageNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-xs font-semibold transition-colors cursor-pointer border border-border shadow-sm"
            >
              <Undo size={14} />
              Undo
            </button>
            <button
              onClick={() => handleClearPage(pageNumber)}
              className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 text-xs font-semibold transition-colors cursor-pointer border border-transparent"
            >
              Clear Page
            </button>
          </div>
        </div>

        {/* Vùng hiển thị PDF và lớp vẽ KonvaDraw */}
        <div className="relative overflow-hidden border border-border rounded-xl shadow-inner bg-white min-h-[400px] flex items-center justify-center">
          <Document
            file={chapterFileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center gap-2 py-20 px-32 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm font-medium animate-pulse">Loading PDF document...</p>
              </div>
            }
          >
            <div className="relative" style={{ width: pageWidth, height: pageHeight }}>
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                onLoadSuccess={onPageLoadSuccess}
                loading={
                  <div className="flex flex-col items-center justify-center absolute inset-0 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm font-medium mt-2">Loading page {pageNumber}...</p>
                  </div>
                }
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              {isPageLoaded && (
                <div className="absolute inset-0 z-20">
                  <KonvaDraw
                    width={pageWidth}
                    height={pageHeight}
                    tool={tool}
                    textInput={textInput}
                    onTextPlaced={() => setTextInput('')}
                    lines={annotationData[pageNumber] || []}
                    setLines={(newLines) => setPageLines(pageNumber, newLines)}
                    texts={annotationText[pageNumber] || []}
                    setTexts={(newTexts) => setPageTexts(pageNumber, newTexts)}
                    color={brushColor}
                  />
                </div>
              )}
            </div>
          </Document>
        </div>

        {/* Phân trang PDF */}
        {numPages && (
          <div className="flex items-center justify-between w-full px-2">
            <button
              disabled={pageNumber <= 1}
              onClick={() => { setPageNumber(prev => prev - 1); setIsPageLoaded(false); }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors cursor-pointer border border-border"
            >
              Previous Page
            </button>
            <span className="text-sm font-semibold text-muted-foreground">
              Page {pageNumber} of {numPages}
            </span>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => { setPageNumber(prev => prev + 1); setIsPageLoaded(false); }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors cursor-pointer border border-border"
            >
              Next Page
            </button>
          </div>
        )}

        {/* Nút Submit Annotation */}
        <div className="w-full border-t border-border pt-4 mt-2">
          <button
            onClick={handleSubmitAnnotation}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer hover:shadow-lg text-sm"
          >
            Submit Annotation
          </button>
        </div>

      </div>
    </div>
  );
}
