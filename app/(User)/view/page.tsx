'use client';

import React, { useState, useEffect } from 'react';
import { Download, ArrowLeft, RotateCw, X } from 'lucide-react';

export default function PdfViewerPage() {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [viewerUrl, setViewerUrl] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [useAltViewer, setUseAltViewer] = useState<boolean>(false);

  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const subj = params.get('subject');
    const yr = params.get('year');

    if (url) {
      setPdfUrl(decodeURIComponent(url));
      setSubject(subj ? decodeURIComponent(subj) : 'PDF Document');
      setYear(yr || '');

      // Set Google Docs Viewer as default
      const googleViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      setViewerUrl(googleViewer);
    } else {
      // Redirect back if no URL provided
      window.location.href = '/';
    }

    // ESC key handler
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.history.back();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleDownload = (): void => {
    if (!pdfUrl) return;

    setDownloading(true);

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `BCA-Sem1-${subject.replace(/\s+/g, '-')}-${year}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      alert('Download started! Check your downloads folder.');
      setDownloading(false);
    }, 500);
  };

  const handleBack = (): void => {
    window.history.back();
  };

  const switchViewer = (): void => {
    if (!pdfUrl) return;

    if (useAltViewer) {
      // Switch back to Google Viewer
      const googleViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
      setViewerUrl(googleViewer);
      setUseAltViewer(false);
    } else {
      // Switch to Mozilla PDF.js Viewer
      const mozillaViewer = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
      setViewerUrl(mozillaViewer);
      setUseAltViewer(true);
    }
  };

  const openInNewTab = (): void => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!pdfUrl) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-black p-4 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={handleBack}
                className="px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-medium flex items-center gap-2"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl font-bold">{subject}</h1>
                {year && <p className="text-sm text-gray-600">Year: {year}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={switchViewer}
                className="px-3 py-2 border-2 border-gray-300 bg-white hover:border-black transition-colors font-medium flex items-center gap-2"
                title="Switch Viewer"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden md:inline">{useAltViewer ? 'Google' : 'Alt'} Viewer</span>
              </button>
              <button
                onClick={openInNewTab}
                className="px-3 py-2 border-2 border-gray-300 bg-white hover:border-black transition-colors font-medium hidden sm:flex items-center gap-2"
                title="Open in New Tab"
              >
                <X className="w-4 h-4" />
                <span className="hidden md:inline">New Tab</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                title="Download PDF"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Viewer Info */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Currently using: <strong>{useAltViewer ? 'Mozilla PDF.js' : 'Google Docs'} Viewer</strong></span>
            <span className="hidden md:inline">• 💡 If PDF doesn't load, try switching viewers</span>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-900 relative overflow-hidden">
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          title="PDF Viewer"
          allow="fullscreen"
        />

        {/* Loading Overlay (appears briefly when switching viewers) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-4 py-2 shadow-lg pointer-events-none">
          <p className="text-sm font-medium">
            {useAltViewer ? 'Mozilla PDF.js Viewer' : 'Google Docs Viewer'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t-2 border-black p-3 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>📄 BCA Semester 1 Question Paper</span>
              <span className="hidden md:inline">⌨️ Press ESC to go back</span>
            </div>
            <span className="hidden sm:inline">For educational purposes only</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}