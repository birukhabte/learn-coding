'use client';

import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, Eye, X, AlertCircle, Github, CheckCircle } from 'lucide-react';

// Types
interface Paper {
  [year: string]: string | null;
}

interface Subject {
  name: string;
  papers: Paper;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

// BCA Semester 1 Subjects with PDF URLs from GitHub via jsdelivr CDN
// jsdelivr provides better CDN performance and no CORS issues
const subjects: Subject[] = [
  {
    name: 'Basic Mathematics',
    papers: {
      2024: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-303102-2024.pdf',
      2023: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-303102-2023.pdf',
      2022: null,
      2021: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-303102-2021.pdf',
      2020: null,
      2019: null,
      2018: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-303102-2018.pdf',
      2017: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-303102-2017.pdf',
      2016: null,
      2015: null,
      2014: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-2014.pdf',
      2013: '/pdf/pyq/bca-1-sem/basic-mathematics/bca-1-sem-basic-mathematics-2013.pdf',
    }
  },
  {
    name: 'Communicative English',
    papers: {
      2024: '/pdf/pyq/bca-1-sem/communicative-english/bca-1-sem-communicative-english-303101-2024.pdf',
      2023: null,
      2022: '/pdf/pyq/bca-1-sem/communicative-english/bca-1-sem-communicative-english-303101-2022.pdf',
      2021: '/pdf/pyq/bca-1-sem/communicative-english/bca-1-sem-communicative-english-303101-2021.pdf',
      2020: null,
      2019: '/pdf/pyq/bca-1-sem/communicative-english/bca-1-sem-communicative-english-303101-2019.pdf',
      2018: '/pdf/pyq/bca-1-sem/communicative-english/bca-1-sem-communicative-english-303101-2018.pdf',
      2017: '/pdf/pyq/bca-1-sem/communicative-english/bca-1-sem-communicative-english-303101-2017.pdf',
      2016: null,
      2015: null,
      2014: null,
      2013: null,
    }
  },
  {
    name: 'Information Technology and Application',
    papers: {
      2024: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2024.pdf',
      2023: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2023.pdf',
      2022: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2022.pdf',
      2021: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2021.pdf',
      2020: null,
      2019: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2019.pdf',
      2018: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2018.pdf',
      2017: '/pdf/pyq/bca-1-sem/information-technology-and-application/bca-1-sem-information-technology-and-application-303103-2017.pdf',
      2016: null,
      2015: null,
      2014: null,
      2013: null,
    }
  },
  {
    name: 'Principles of Management and Organization',
    papers: {
      2024: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principle-of-management-and-organization-303104-2024.pdf',
      2023: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-303104-2023.pdf',
      2022: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-303104-2022.pdf',
      2021: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-303104-2021.pdf',
      2020: null,
      2019: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-303104-2019.pdf',
      2018: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-303104-2018.pdf',
      2017: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-303104-2017.pdf',
      2016: null,
      2015: null,
      2014: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principle-of-management-and-organization-2014.pdf',
      2013: '/pdf/pyq/bca-1-sem/principles-of-management-and-organization/bca-1-sem-principles-of-management-and-organization-2013.pdf',
    }
  },
  {
    name: 'Problem Solving Using Programming Skills',
    papers: {
      2024: null,
      2023: '/pdf/pyq/bca-1-sem/pspc/PSPC-1-SEM-2023.pdf',
      2022: '/pdf/pyq/bca-1-sem/pspc/PSPC-1-SEM-2022.pdf',
      2021: null,
      2020: null,
      2019: null,
      2018: null,
      2017: '/pdf/pyq/bca-1-sem/pspc/PSPC-1-SEM-2017.pdf',
      2016: null,
      2015: null,
      2014: null,
      2013: null,
    }
  }
];

const years: number[] = Array.from({ length: 12 }, (_, i) => 2024 - i); // 2024 to 2013

// Alert Modal Component
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  year: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, subject, year }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white border-4 border-black p-6 max-w-md w-full shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 p-1 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">PDF Not Available</h2>
          <p className="text-gray-700 mb-2">
            The question paper for <span className="font-semibold">{subject}</span> ({year}) is currently not available.
          </p>
          <p className="text-sm text-gray-600">
            Please check back later or select a different year.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Notification Toast Component
interface NotificationToastProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`p-4 border-2 ${
        notification.type === 'success' 
          ? 'bg-green-50 border-green-600 text-green-800' 
          : 'bg-red-50 border-red-600 text-red-800'
      } shadow-lg max-w-sm flex items-start gap-3`}>
        {notification.type === 'success' ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        <p className="text-sm font-medium flex-1">{notification.message}</p>
        <button
          onClick={onClose}
          className="hover:bg-black/10 p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function PyqDownloadPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Get available years for selected subject
  const getAvailableYearsForSubject = (subjectName: string): string[] => {
    const subject = subjects.find(s => s.name === subjectName);
    if (!subject) return [];
    return Object.entries(subject.papers)
      .filter(([_, url]) => url !== null)
      .map(([year, _]) => year)
      .sort((a, b) => parseInt(b) - parseInt(a));
  };

  // Reset year selection when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const availableYears = getAvailableYearsForSubject(selectedSubject);
      // If current selected year is not available for the new subject, reset it
      if (selectedYear && !availableYears.includes(selectedYear)) {
        setSelectedYear('');
      }
    }
  }, [selectedSubject]);

  const getPdfUrl = (): string | null => {
    if (!selectedSubject || !selectedYear) return null;
    const subject = subjects.find(s => s.name === selectedSubject);
    return subject?.papers[selectedYear] || null;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && isValid && !downloading) {
        e.preventDefault();
        handleDownload();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && isValid && !viewLoading) {
        e.preventDefault();
        handleView();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedSubject, selectedYear, downloading, viewLoading]);

  const handleView = (): void => {
    const pdfUrl = getPdfUrl();

    if (!pdfUrl) {
      setShowAlert(true);
      return;
    }

    setViewLoading(true);

    // Open PDF directly
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setViewLoading(false);
    }, 300);
  };

  const handleDownload = (): void => {
    const pdfUrl = getPdfUrl();

    if (!pdfUrl) {
      setShowAlert(true);
      return;
    }

    setDownloading(true);

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `BCA-Sem1-${selectedSubject.replace(/\s+/g, '-')}-${selectedYear}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 500);
  };

  const isValid = selectedSubject && selectedYear;
  const pdfUrl = getPdfUrl();
  const isPdfAvailable = isValid && pdfUrl;

  // Count available papers per subject
  const getAvailableYears = (subjectName: string): string[] => {
    const subject = subjects.find(s => s.name === subjectName);
    if (!subject) return [];
    return Object.entries(subject.papers)
      .filter(([_, url]) => url !== null)
      .map(([year, _]) => year)
      .sort((a, b) => parseInt(b) - parseInt(a));
  };

  // Get filtered years for year selector
  const availableYearsForSelector = selectedSubject 
    ? getAvailableYearsForSubject(selectedSubject)
    : [];

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">BCA Semester 1</h1>
          <p className="text-lg font-medium mb-1">Previous Year Questions</p>
          <p className="text-sm text-gray-600">Select subject and year to view or download</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Subject Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.name} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Year
              {selectedSubject && availableYearsForSelector.length > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  ({availableYearsForSelector.length} available)
                </span>
              )}
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={!selectedSubject}
                className="w-full px-4 py-3 border-2 border-black bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedSubject 
                    ? (availableYearsForSelector.length > 0 
                        ? 'Select a year' 
                        : 'No papers available')
                    : 'Select a subject first'}
                </option>
                {availableYearsForSelector.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* View Button */}
            <button
              onClick={handleView}
              disabled={!isValid || viewLoading}
              className="px-6 py-4 border-2 border-black bg-white text-black font-medium disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-black hover:text-white active:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {viewLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Opening...</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  View
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!isValid || downloading}
              className="px-6 py-4 bg-black text-white font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-800 active:bg-gray-900 transition-colors flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Info */}
        {isValid && (
          <div className={`mt-8 p-4 border-2 ${isPdfAvailable ? 'border-black bg-gray-50' : 'border-red-600 bg-red-50'}`}>
            <p className="text-sm font-medium mb-1">Selected:</p>
            <p className="text-lg font-semibold mb-2">
              {selectedSubject} - {selectedYear}
            </p>
            {isPdfAvailable ? (
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 border border-green-700">
                  ✓ Available
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 border border-red-700">
                  ✗ Not Available
                </span>
              </div>
            )}
          </div>
        )}

        {/* Available Papers Info */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-300">
          <p className="text-xs font-medium mb-3">Available Papers by Subject:</p>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-600 font-medium">Basic Mathematics:</span>
              <div className="mt-1 text-gray-800">
                {getAvailableYears('Basic Mathematics').join(', ') || 'None'}
              </div>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <span className="text-gray-600 font-medium">Communicative English:</span>
              <div className="mt-1 text-gray-800">
                {getAvailableYears('Communicative English').join(', ') || 'None'}
              </div>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <span className="text-gray-600 font-medium">IT and Application:</span>
              <div className="mt-1 text-gray-800">
                {getAvailableYears('Information Technology and Application').join(', ') || 'None'}
              </div>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <span className="text-gray-600 font-medium">Management:</span>
              <div className="mt-1 text-gray-800">
                {getAvailableYears('Principles of Management and Organization').join(', ') || 'None'}
              </div>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <span className="text-gray-600 font-medium">Programming Skills:</span>
              <div className="mt-1 text-red-600 font-medium">
                {getAvailableYears('Problem Solving Using Programming Skills').join(', ') || 'None yet'}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="mt-8 flex items-center justify-center">
          <a
            href="https://github.com/pyKinsu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-black font-medium hover:bg-black hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Made By ,<a href="https://github.com/pyKinsu">Kinsu</a></p>
          <p className="mt-1 text-xs">For educational purposes only</p>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal 
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        subject={selectedSubject}
        year={selectedYear}
      />

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
