import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Languages } from 'lucide-react';
import { getLetterContent } from '@/utils/letterUtils';
import type { Report } from '@/pages/Reports/ReportDetailsPage';

const APP_URL = typeof window !== 'undefined' ? window.location.origin + '/app/live-map' : 'https://saafasewa.org/app';

/** Generate pre-filled tweet and open Twitter Web Intent */
export function shareToX(wasteType: string, location: string, reportId: string): void {
    const url = `${APP_URL}?r=${String(reportId)}`;
    const text = `🚨 Urgent: ${wasteType} waste reported at ${location}. @KTMMetropolitan please take action! Generated via #SaafaSewa ${url}`;
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
}

interface CivicActionShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report;
}

export default function CivicActionShareModal({ isOpen, onClose, report }: CivicActionShareModalProps) {
    const [lang, setLang] = useState<'en' | 'np'>('en');
    const letterRef = useRef<HTMLDivElement>(null);

    const location = report.ward || 'Kathmandu';
    const wasteType = report.type || report.title || 'Waste';
    const letterBody = getLetterContent(lang, location, report.lat, report.lng, wasteType);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handleShareToX = useCallback(() => {
        shareToX(wasteType, location, report.id);
    }, [wasteType, location, report.id]);

    if (!isOpen) return null;

    const modalContent = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="civic-share-print-root fixed inset-0 z-[1100] bg-slate-900/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row gap-6 md:gap-8 bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Left: Controls - hidden when printing */}
                    <div className="civic-share-controls flex flex-row md:flex-col gap-4 shrink-0 md:w-56 order-2 md:order-1">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:relative md:top-0 md:right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex-1 md:flex-initial flex flex-col gap-4">
                            {/* Language Toggle */}
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                                <Languages size={18} className="text-white/70 shrink-0" />
                                <div className="flex rounded-lg overflow-hidden bg-white/5 p-0.5">
                                    <button
                                        onClick={() => setLang('en')}
                                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                                            lang === 'en'
                                                ? 'bg-emerald-500 text-white'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => setLang('np')}
                                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                                            lang === 'np'
                                                ? 'bg-emerald-500 text-white'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        नेपाली
                                    </button>
                                </div>
                            </div>

                            {/* Post to X */}
                            <button
                                onClick={handleShareToX}
                                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-600/50"
                            >
                                <XIcon className="w-5 h-5" />
                                Post to X
                            </button>

                            {/* Save as PDF / Print */}
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors"
                            >
                                <Printer size={18} />
                                Save as PDF / Print
                            </button>
                        </div>
                    </div>

                    {/* Right: A4 Letter Document */}
                    <div className="flex-1 min-h-0 flex items-start justify-center order-1 md:order-2 overflow-auto">
                        <div
                            ref={letterRef}
                            className="letter-document w-full max-w-[210mm] bg-white rounded-lg shadow-2xl overflow-visible flex flex-col shrink-0"
                            style={{
                                minHeight: '297mm',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
                            }}
                        >
                            {/* Header watermark */}
                            <div className="px-12 pt-8 pb-4 border-b border-slate-200/80">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/80">
                                    Saafa Sewa Official Report
                                </p>
                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                                    Digital Civic Advocacy Letter
                                </p>
                            </div>

                            {/* Letter body */}
                            <div
                                className={`flex-1 px-12 py-8 text-slate-700 leading-relaxed ${
                                    lang === 'np' ? 'font-[Georgia,Noto_Sans_Devanagari,serif]' : 'font-serif'
                                }`}
                                style={{
                                    fontFamily: lang === 'np' ? "'Noto Sans Devanagari', Georgia, serif" : undefined,
                                }}
                            >
                                <pre
                                    className="whitespace-pre-wrap font-inherit text-[13px] md:text-[14px] leading-[1.8] m-0"
                                    style={{ fontFamily: 'inherit' }}
                                >
                                    {letterBody}
                                </pre>
                            </div>

                            {/* QR placeholder */}
                            <div className="px-12 pb-10 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                                        <span className="text-[8px] font-bold text-slate-400 text-center leading-tight px-1">
                                            QR
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            Scan to view digital report
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium break-all">
                                            {APP_URL}?r={String(report.id)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Print-only styles: only the A4 letter visible; hide app, controls, map, sidebar */}
            <style>{`
                @media print {
                    body > *:not(.civic-share-print-root) {
                        display: none !important;
                    }
                    .civic-share-print-root {
                        position: fixed !important;
                        inset: 0 !important;
                        background: white !important;
                        z-index: 99999 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .civic-share-print-root .civic-share-controls {
                        display: none !important;
                    }
                    .civic-share-print-root .letter-document {
                        position: absolute !important;
                        top: 0 !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        width: 210mm !important;
                        min-height: 297mm !important;
                        max-width: none !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        background: white !important;
                    }
                }
            `}</style>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}

/** X (Twitter) logo as inline SVG */
function XIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
            aria-hidden
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
