"use client";

import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  goToPage?: number;
  onGoToPageHandled?: () => void;
  highlightedPage?: number;
}

export function PdfViewer({ fileUrl, goToPage, onGoToPageHandled, highlightedPage }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goToPage != null && goToPage >= 1 && (!numPages || goToPage <= numPages)) {
      setPageNumber(goToPage);
      onGoToPageHandled?.();
    }
  }, [goToPage, numPages, onGoToPageHandled]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    setError(err.message);
  }, []);

  const is404 = error?.includes("404");
  const errorMessage = is404
    ? "PDF file not available. The document may still be processing, or the backend may not expose file download yet."
    : error;

  return (
    <div className="flex flex-col h-full">
      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm">
          {is404 ? (
            <p>{errorMessage}</p>
          ) : (
            <p>Failed to load PDF: {errorMessage}</p>
          )}
        </div>
      ) : (
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            Loading PDF...
          </div>
        }
      >
        <div className="flex items-center justify-between gap-2 py-2 px-1 border-b border-border/60">
          <Button
            variant="ghost"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages ?? "—"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={!numPages || pageNumber >= numPages}
            onClick={() => setPageNumber((p) => Math.min(numPages ?? p, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <div
            className={`flex justify-center transition-shadow ${
              highlightedPage === pageNumber ? "rounded-md ring-2 ring-primary/50 shadow-lg" : ""
            }`}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="max-w-full"
            />
          </div>
        </div>
      </Document>
      )}
    </div>
  );
}
