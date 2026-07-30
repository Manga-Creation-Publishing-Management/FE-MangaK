import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PreviewModal({ isOpen, onClose, fileUrl, role }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    if (!isOpen) return null;

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-[95vw] md:w-[85vw] lg:w-[1000px] max-w-[100vw] max-h-[95vh] overflow-y-auto flex flex-col items-center gap-4 relative">

                <div className="flex justify-between items-center w-full pb-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <X />
                    </button>
                </div>

                <div className="relative overflow-auto border border-border rounded-xl shadow-inner bg-muted min-h-[400px] max-h-[65vh] w-full flex justify-center items-start p-4">
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
                        <div className="relative">
                            <Page pageNumber={pageNumber} />
                        </div>
                    </Document>
                </div>

                {numPages && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full px-2">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(prev => prev - 1)}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-border w-full sm:w-auto text-center"
                        >
                            Previous Page
                        </button>
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground order-first sm:order-none">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(prev => prev + 1)}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors cursor-pointer border border-border w-full sm:w-auto text-center"
                        >
                            Next Page
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
