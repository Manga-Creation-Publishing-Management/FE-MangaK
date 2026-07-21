import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Undo, Brush, Type, X } from "lucide-react";
// import { KonvaDraw } from "./KonvaDraw";
import { useChapterAnnotation } from "../../features/chapters/hooks/useChapterAnnotation";

// Kích hoạt Web Worker để thư viện react-pdf xử lý PDF ở một luồng độc lập
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PreviewModal({ isOpen, onClose, fileUrl, role }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // const {
    // tool,
    // setTool,
    // annotationData,
    // annotationText,
    // textInput,
    // setTextInput,
    // brushColor,
    // setBrushColor,
    // pageNumber,
    // setPageNumber,
    // pageWidth,
    // setPageWidth,
    // pageHeight,
    // isPageLoaded,
    // setIsPageLoaded,
    // numPages,
    // handleUndo,
    // handleClearPage,
    // setPageLines,
    // setPageTexts,
    //     closeModal,
    //     handleBackdropClick,
    //     onPageLoadSuccess,
    //     onDocumentLoadSuccess,
    // } = useChapterAnnotation(onClose);

    // const containerRef = useRef(null);

    // useEffect(() => {
    //     if (isOpen && containerRef.current) {
    //         // 32px cho phần padding 2 bên (p-4 = 16px * 2)
    //         setPageWidth(containerRef.current.clientWidth - 32);
    //     }
    // }, [isOpen, setPageWidth]);

    if (!isOpen) return null;

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-[95vw] md:w-[85vw] lg:w-[1000px] max-w-[100vw] max-h-[95vh] overflow-y-auto flex flex-col items-center gap-4 relative">

                {/* Tiêu đề & Nút Close */}
                <div className="flex justify-between items-center w-full pb-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <X />
                    </button>
                </div>


                {/* Vùng hiển thị PDF và lớp vẽ KonvaDraw */}
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
                            <Page
                                pageNumber={pageNumber}
                            // width={pageWidth}
                            // onLoadSuccess={onPageLoadSuccess}
                            // loading={
                            //     <div className="flex flex-col items-center justify-center absolute inset-0 text-muted-foreground">
                            //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            //         <p className="text-sm font-medium mt-2">Loading page {pageNumber}...</p>
                            //     </div>
                            // }
                            />
                            {/* {isPageLoaded && (
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
                            )} */}
                        </div>
                    </Document>
                </div>

                {/* Phân trang PDF */}
                {numPages && (
                    <div className="flex items-center justify-between w-full px-2">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(prev => prev - 1)}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors cursor-pointer border border-border"
                        >
                            Previous Page
                        </button>
                        <span className="text-sm font-semibold text-muted-foreground">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(prev => prev + 1)}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors cursor-pointer border border-border"
                        >
                            Next Page
                        </button>
                    </div>
                )}

                {/* Nút Submit Annotation */}
                {/* <div className="w-full border-t border-border pt-4 mt-2">
                    <button
                        onClick={() => handleSubmitAnnotation(seriesId, chapterId, taskId, role)}
                        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer hover:shadow-lg text-sm"
                    >
                        Submit Annotation
                    </button>
                </div> */}

            </div>
        </div>
    );
}
