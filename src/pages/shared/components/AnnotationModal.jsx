import { useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { KonvaDraw } from '@/pages/shared/components/KonvaDraw';
import { useChapterAnnotation } from '@/features/chapters/hooks/useChapterAnnotation';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function AnnotationModal({ isOpen, onClose, fileUrl, seriesId = null, chapterId = null, taskId = null, role, onRejectTrigger, isReadOnly = false, initialFeedbackJson = null }) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const {
    tool,
    setTool,
    annotationData,
    annotationText,
    brushColor,
    setBrushColor,
    pageNumber,
    setPageNumber,
    pageWidth,
    setPageWidth,
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
  } = useChapterAnnotation(onClose, initialFeedbackJson);

  const handleCombineSubmit = async () => {
    
    const isSuccess = await handleSubmitAnnotation(seriesId, chapterId, taskId, role);

    if (isSuccess && onRejectTrigger) {
      onRejectTrigger();
    }
  };
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      
      setPageWidth(containerRef.current.clientWidth - 32);
    }
  }, [isOpen, setPageWidth]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-[95vw] md:w-[85vw] lg:w-[1000px] max-w-[100vw] max-h-[95vh] overflow-y-auto flex flex-col items-center gap-4 relative">

        <div className="flex justify-between items-center w-full pb-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isReadOnly ? "View Feedback (Read-only)" : "View and Annotate"}
          </h2>
          <div className="flex items-center gap-3">
            {isReadOnly && (
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {showAnnotations ? <EyeOff size={18} /> : <Eye size={18} />}
                {showAnnotations ? "Hide Annotations" : "Show Annotations"}
              </button>
            )}
            <button
              onClick={closeModal}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <X />
            </button>
          </div>
        </div>

        {!isReadOnly && (
          <>
            
            <div className="flex flex-wrap items-center justify-between gap-4 w-full bg-muted/40 p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            
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
            <button
              onClick={() => setTool('move')}
              className={`p-2 rounded-lg transition-all ${tool === 'move' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              title="Move"
            >
              <Move />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-muted-foreground'
                }`}
              title="Eraser"
            >
              <Eraser />
            </button>
          </div>
        </div>

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
          </>
        )}

        <div ref={containerRef} className="relative overflow-auto border border-border rounded-xl shadow-inner bg-muted min-h-[400px] max-h-[65vh] w-full flex justify-center items-start p-4">
          <Document
            file={fileUrl}
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
              {isPageLoaded && showAnnotations && (
                <div className="absolute inset-0 z-20">
                  <KonvaDraw
                    width={pageWidth}
                    height={pageHeight}
                    tool={tool}
                    lines={annotationData[pageNumber] || []}
                    setLines={(newLines) => setPageLines(pageNumber, newLines)}
                    texts={annotationText[pageNumber] || []}
                    setTexts={(newTexts) => setPageTexts(pageNumber, newTexts)}
                    color={brushColor}
                    isReadOnly={isReadOnly}
                  />
                </div>
              )}
            </div>
          </Document>
        </div>

        {numPages && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full px-2">
            <button
              disabled={pageNumber <= 1}
              onClick={() => { setPageNumber(prev => prev - 1); setIsPageLoaded(false); }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-border w-full sm:w-auto text-center"
            >
              Previous Page
            </button>
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground order-first sm:order-none">
              Page {pageNumber} of {numPages}
            </span>
            <button
              disabled={pageNumber >= numPages}
              onClick={() => { setPageNumber(prev => prev + 1); setIsPageLoaded(false); }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-border w-full sm:w-auto text-center"
            >
              Next Page
            </button>
          </div>
        )}

        {!isReadOnly && (
          <div className="w-full border-t border-border pt-4 mt-2">
            <button
              onClick={handleCombineSubmit}
              
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer hover:shadow-lg text-sm"
            >
              Submit Annotation
            </button>
          </div>
        )}

      </div>
    </div >
  );
}
