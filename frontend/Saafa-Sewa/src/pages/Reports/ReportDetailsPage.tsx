import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    ThumbsUp,
    Share2,
    Coins,
    MapPin,
    Clock,
    User,
    ChevronUp,
    AlertCircle,
    ShieldCheck
} from 'lucide-react';
import { useUpvotePin, useRemoveUpvotePin } from '@/features/pins/usePins';

export interface Report {
    id: number;
    title: string;
    lat: number;
    lng: number;
    status: 'green' | 'yellow' | 'red';
    days: number;
    ward: string;
    type: string;
    description?: string;
    imageUrl?: string;
    reportedBy: {
        name: string;
        avatar: string;
    };
    bountyPool: string;
    timestamp: string;
    votes: number;
}

interface ReportDetailsPanelProps {
    report: Report | null;
    onClose: () => void;
}

export default function ReportDetailsPanel({ report, onClose }: ReportDetailsPanelProps) {
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const upvoteMutation = useUpvotePin();
    const removeUpvoteMutation = useRemoveUpvotePin();

    useEffect(() => {
        if (report) {
            setVoteCount(report.votes);
            setIsUpvoted(false);
            setImageLoaded(false);
        }
    }, [report]);

    const handleUpvote = async () => {
        if (!report) return;

        try {
            if (isUpvoted) {
                // Remove upvote
                await removeUpvoteMutation.mutateAsync(report.id.toString());
                setIsUpvoted(false);
                setVoteCount(prev => Math.max(prev - 1, 0));
            } else {
                // Add upvote
                await upvoteMutation.mutateAsync(report.id.toString());
                setIsUpvoted(true);
                setVoteCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Failed to update upvote:", error);
        }
    };

    if (!report) return null;


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'red': return 'text-rose-500 bg-rose-50';
            case 'yellow': return 'text-amber-500 bg-amber-50';
            default: return 'text-emerald-500 bg-emerald-50';
        }
    };

    const getPhase = (days: number) => {
        if (days >= 7) return 'Phase 3: Civic Command';
        if (days >= 4) return 'Phase 2: Janta Override';
        return 'Phase 1: Government Window';
    };

    return (
        <AnimatePresence>
            {report && (
                <>
                    {/* Mobile Overlay Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1001] lg:hidden"
                    />

                    {/* Details Panel */}
                    <motion.div
                        initial={{ x: '-100%', y: 0 }}
                        animate={{ x: 0, y: 0 }}
                        exit={{ x: '-100%', y: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-full lg:w-[420px] bg-white z-[1002] shadow-2xl lg:m-4 lg:rounded-xl overflow-hidden flex flex-col h-full lg:h-[calc(100vh-2rem)]"
                    >
                        {/* Header Image Area */}
                        <div className="relative h-64 lg:h-72 w-full bg-slate-100 flex-shrink-0">
                            {!imageLoaded && (
                                <div className="absolute inset-0 animate-pulse bg-slate-200 flex items-center justify-center">
                                    <AlertCircle className="text-slate-300" size={48} />
                                </div>
                            )}
                            <img
                                src={report.imageUrl || `https://picsum.photos/seed/${report.id}/800/600`}
                                alt={report.title}
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all z-10 cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            {/* Mobile Swipe Indicator */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full lg:hidden" />

                            <div className="absolute bottom-6 left-8 right-8">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${getStatusColor(report.status)}`}>
                                    <ShieldCheck size={12} />
                                    {getPhase(report.days)}
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                                    {report.title || report.type}
                                </h2>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                            {/* Header Details */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">LOCATION CONTEXT</p>
                                    <h3 className="text-lg font-bold text-slate-900">{report.ward}, Kathmandu</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AGING STATUS</p>
                                    <p className={`text-sm font-black ${report.status === 'red' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {report.days} Days Active
                                    </p>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-between py-6 border-y border-slate-100">
                                <div className="flex flex-col items-center gap-2">
                                    <motion.button
                                        whileTap={{
                                            scale: 0.9,
                                            boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
                                        }}
                                        onClick={handleUpvote}
                                        disabled={upvoteMutation.isPending || removeUpvoteMutation.isPending}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isUpvoted
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                                            }`}
                                    >
                                        <ThumbsUp size={24} className={isUpvoted ? 'fill-white' : ''} />
                                    </motion.button>
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                        {voteCount} Votes
                                    </span>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <motion.button
                                        whileTap={{
                                            scale: 0.9,
                                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                                        }}
                                        className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer"
                                    >
                                        <Share2 size={24} />
                                    </motion.button>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share</span>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <motion.button
                                        whileTap={{
                                            scale: 0.9,
                                            boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                                        }}
                                        className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all cursor-pointer"
                                    >
                                        <Coins size={24} />
                                    </motion.button>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pledge</span>
                                </div>
                            </div>

                            {/* Information Section */}
                            <div className="space-y-6">
                                <InfoRow
                                    icon={<MapPin size={18} />}
                                    label="EXACT COORDINATES"
                                    value={`${report.lat.toFixed(6)}, ${report.lng.toFixed(6)}`}
                                    subValue="Tap to copy location"
                                />
                                <InfoRow
                                    icon={<Clock size={18} />}
                                    label="TIME REPORTED"
                                    value={report.timestamp || "March 5, 2026 • 09:15 AM"}
                                    subValue="Incident logged into system"
                                />
                                <InfoRow
                                    icon={<User size={18} />}
                                    label="REPORTED BY"
                                    value={report.reportedBy?.name || "Anonymous Citizen"}
                                    avatar={report.reportedBy?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${report.id}`}
                                />
                                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <Coins size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">ACTIVE BOUNTY POOL</span>
                                        </div>
                                        <span className="text-xl font-black text-emerald-600">{report.bountyPool || "रू 1,200"}</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-600/60 font-medium leading-relaxed">
                                        This bounty is available for any verified gig-worker once the Government Window (Phase 1) expires.
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            {report.description && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADDITIONAL INTEL</p>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        {report.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                            <motion.button
                                whileTap={{
                                    scale: 0.98,
                                    boxShadow: "0 0 25px rgba(18, 191, 88, 0.5)",
                                }}
                                className="w-full bg-primary text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-emerald-600 transition-all cursor-pointer"
                            >
                                Claim Bounty
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function InfoRow({ icon, label, value, subValue, avatar }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                {avatar ? (
                    <img src={avatar} alt={value} className="w-full h-full rounded-xl object-cover" />
                ) : (
                    icon
                )}
            </div>
            <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-900">{value}</p>
                {subValue && <p className="text-[10px] text-slate-400 font-medium">{subValue}</p>}
            </div>
        </div>
    );
}
