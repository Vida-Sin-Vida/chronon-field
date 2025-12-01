'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ src }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [containerWidth, setContainerWidth] = useState(800);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    // Responsive width
    useEffect(() => {
        const updateWidth = () => {
            const container = document.getElementById('pdf-container');
            if (container) {
                setContainerWidth(container.clientWidth);
            }
        };

        window.addEventListener('resize', updateWidth);
        updateWidth();

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    return (
        <div id="pdf-container" className="relative w-full h-full flex items-center justify-center bg-white/5 overflow-hidden">
            <Document
                file={src}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
                loading={
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            >
                <Page
                    pageNumber={pageNumber}
                    width={Math.min(containerWidth, 1100)} // Max width constraint
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-2xl"
                />
            </Document>

            {/* Navigation Arrows */}
            {numPages && (
                <>
                    <button
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 backdrop-blur-sm ${pageNumber <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        aria-label="Previous page"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 backdrop-blur-sm ${pageNumber >= numPages ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        aria-label="Next page"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Page Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-medium">
                        Page {pageNumber} sur {numPages}
                    </div>
                </>
            )}
        </div>
    );
}
