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
    AlertCircle,
    ShieldCheck,
    Upload
} from 'lucide-react';
import { useUpvotePin, useRemoveUpvotePin, usePledgePin, usePledgesForPin } from '@/features/pins/usePins';
import { useClaimBounty } from '@/features/pins/useProof';
import { useAppDispatch, useAppSelector } from '@/store';
import DetailsPanelSkeleton from '@/components/DetailsPanelSkeleton';
import PledgeModal from '@/components/PledgeModal';
import ProofUploadModal from '@/components/ProofUploadModal';
import CleanupComparisonModal from '@/components/CleanupComparisonModal';
import CivicActionShareModal from '@/components/CivicActionShareModal';
import { toast } from 'sonner';
import { updateUser } from '@/store/userSlice';

export interface Report {
    id: string;
    title: string;
    lat: number;
    lng: number;
    status: 'green' | 'yellow' | 'red';
    pinStatus?: 'PENDING_GOV' | 'BOUNTY_OPEN' | 'CLAIMED' | 'VERIFYING' | 'RESOLVED';
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
    cleanupProof?: {
        id: string;
        cleanerId: string;
        afterImage: string | null;
        beforeImage: string;
        description?: string;
        upvotes: number;
        createdAt: string;
        cleaner: {
            id: string;
            name: string;
            profilePic?: string;
        };
    } | null;
}

interface ReportDetailsPanelProps {
    report: Report | null;
    onClose: () => void;
    onVoteChange?: (votes: number) => void;
}

export default function ReportDetailsPanel({ report, onClose, onVoteChange }: ReportDetailsPanelProps) {
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [isPledgeOpen, setIsPledgeOpen] = useState(false);
    const [optimisticBountyDelta, setOptimisticBountyDelta] = useState(0);
    const [isProofUploadOpen, setIsProofUploadOpen] = useState(false);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const dispatch = useAppDispatch();
    const upvoteMutation = useUpvotePin();
    const removeUpvoteMutation = useRemoveUpvotePin();
    const pledgeMutation = usePledgePin();
    const claimBountyMutation = useClaimBounty();
    const userBalance = useAppSelector((state) => state.user.user?.mockBalance ?? 0);
    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const { data: pledges, isLoading: isPledgesLoading } = usePledgesForPin(report?.id || "");

    useEffect(() => {
        if (report) {
            setVoteCount(report.votes);
            setIsUpvoted(false);
            setImageLoaded(false);
            setIsPledgeOpen(false);
            setOptimisticBountyDelta(0);
            setIsProofUploadOpen(false);
            setIsComparisonOpen(false);
            setIsShareModalOpen(false);

            // Only show skeleton if it's a completely different report
            setShowSkeleton(true);
            const t = window.setTimeout(() => setShowSkeleton(false), 800);
            return () => window.clearTimeout(t);
        }
    }, [report?.id]);

    const handleUpvote = async () => {
        if (!report) return;

        try {
            if (isUpvoted) {
                // Remove upvote
                const updatedPin = await removeUpvoteMutation.mutateAsync(report.id.toString());
                const newCount = Math.max((updatedPin?.upvotes ?? voteCount - 1), 0);
                setIsUpvoted(false);
                setVoteCount(newCount);
                onVoteChange?.(newCount);
            } else {
                // Add upvote
                const updatedPin = await upvoteMutation.mutateAsync(report.id.toString());
                const newCount = updatedPin?.upvotes ?? voteCount + 1;
                setIsUpvoted(true);
                setVoteCount(newCount);
                onVoteChange?.(newCount);
            }
        } catch (error) {
            console.error("Failed to update upvote:", error);
            toast.error("Failed to update vote");
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

    const baseBounty = parseRupees(report.bountyPool);
    const displayedBounty = baseBounty + optimisticBountyDelta;

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
                        {showSkeleton ? (
                            <div className="relative h-full">
                                <DetailsPanelSkeleton />
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-10 h-10 bg-white/70 hover:bg-white text-slate-800 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
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
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isUpvoted
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20'
                                            }`}
                                    >
                                        <ThumbsUp size={28} strokeWidth={2.5} className={isUpvoted ? 'fill-white' : ''} />
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
                                        onClick={() => {
                                            setIsShareModalOpen(true)
                                        }}
                                        className="w-16 h-16 rounded-full bg-slate-500/10 border-2 border-slate-500/10 text-slate-500 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-600 transition-all cursor-pointer"
                                    >
                                        <Share2 size={28} strokeWidth={2.5} />
                                    </motion.button>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share</span>
                                </div>

                                {report.status === 'red' && (
                                    <div className="flex flex-col items-center gap-2">
                                        <motion.button
                                            whileTap={{
                                                scale: 0.9,
                                                boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                                            }}
                                            onClick={() => setIsPledgeOpen(true)}
                                            className="w-16 h-16 rounded-full bg-slate-500/10 border-2 border-slate-500/10 text-slate-500 flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-600 transition-all cursor-pointer"
                                        >
                                            <Coins size={28} strokeWidth={2.5} />
                                        </motion.button>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pledge</span>
                                    </div>
                                )}
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
                                        <span className="text-xl font-black text-emerald-600">
                                            रू {displayedBounty.toLocaleString()}
                                        </span>
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

                            {/* Pledgers List */}
                            {report.status === 'red' && (
                                <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Community Backers</h4>
                                    {isPledgesLoading ? (
                                        <div className="space-y-3">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : pledges && pledges.length > 0 ? (
                                        <div className="space-y-3">
                                            {pledges.map((pledge) => (
                                                <div key={pledge.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 border border-emerald-200 shrink-0">
                                                            {pledge.user.profilePic ? (
                                                                <img
                                                                    src={pledge.user.profilePic}
                                                                    alt={pledge.user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-emerald-600">
                                                                    {pledge.user.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700">{pledge.user.name}</span>
                                                    </div>
                                                    <span className="text-sm font-black text-emerald-600">
                                                        रू {pledge.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                                            <p className="text-sm font-medium text-slate-500 mb-1">No community pledges yet.</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Be the first to back this cleanup effort!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                            {(() => {
                                const isZeroBounty = report.bountyPool === 'Rs 0' || report.bountyPool === 'रू 0' || report.bountyPool === '0';
                                const proof = report.cleanupProof;
                                const isMyClaim = proof && currentUserId && proof.cleanerId === currentUserId;

                                // BOUNTY_OPEN: show Claim button (no proof exists yet)
                                if (report.pinStatus === 'BOUNTY_OPEN' && !proof) {
                                    return (
                                        <motion.button
                                            whileTap={!isZeroBounty ? { scale: 0.98, boxShadow: "0 0 25px rgba(18, 191, 88, 0.5)" } : {}}
                                            disabled={isZeroBounty || claimBountyMutation.isPending}
                                            onClick={async () => {
                                                try {
                                                    await claimBountyMutation.mutateAsync(report.id);
                                                    toast.success("Bounty Claimed!", { description: "Now upload your cleanup proof." });
                                                } catch (e) {
                                                    const msg = e instanceof Error ? e.message : "Failed to claim bounty";
                                                    toast.error("Claim failed", { description: msg });
                                                }
                                            }}
                                            className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all 
                                                ${isZeroBounty
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                    : 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-emerald-600 cursor-pointer'
                                                }`}
                                        >
                                            {claimBountyMutation.isPending ? 'Claiming...' : 'Claim This Bounty'}
                                        </motion.button>
                                    );
                                }

                                // CLAIMED: only the claimer sees Upload button
                                if (report.pinStatus === 'CLAIMED' && isMyClaim) {
                                    return (
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsProofUploadOpen(true)}
                                            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all bg-teal-500 text-white shadow-xl shadow-teal-500/20 hover:bg-teal-600 cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <Upload size={16} />
                                            Upload Cleanup Proof
                                        </motion.button>
                                    );
                                }

                                // CLAIMED by someone else: show info
                                if (report.pinStatus === 'CLAIMED' && proof && !isMyClaim) {
                                    return (
                                        <div className="w-full py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
                                            <p className="text-sm font-bold text-slate-500">
                                                Claimed by <span className="text-slate-700">{proof.cleaner.name}</span>
                                            </p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Awaiting cleanup proof</p>
                                        </div>
                                    );
                                }

                                // VERIFYING / RESOLVED: show view proof
                                if ((report.pinStatus === 'VERIFYING' || report.pinStatus === 'RESOLVED') && proof?.afterImage) {
                                    return (
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsComparisonOpen(true)}
                                            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            View Cleanup Proof
                                        </motion.button>
                                    );
                                }

                                // Default for PENDING_GOV or other statuses
                                return (
                                    <motion.button
                                        disabled
                                        className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    >
                                        Awaiting Bounty Activation
                                    </motion.button>
                                );
                            })()}
                        </div>
                            </>
                        )}
                    </motion.div>

                    <PledgeModal
                        isOpen={isPledgeOpen}
                        onClose={() => setIsPledgeOpen(false)}
                        userBalance={userBalance}
                        onSubmit={async (amount) => {
                            setOptimisticBountyDelta((d) => d + amount);
                            dispatch(updateUser({ mockBalance: Math.max(userBalance - amount, 0) }));

                            try {
                                await pledgeMutation.mutateAsync({ pinId: report.id.toString(), amount });
                                toast.success("Pledge confirmed", {
                                    description: `You pledged ₹${amount}. Thank you for backing this cleanup effort.`,
                                });
                            } catch (e) {
                                setOptimisticBountyDelta((d) => d - amount);
                                dispatch(updateUser({ mockBalance: userBalance }));

                                const message = e instanceof Error ? e.message : "Failed to create pledge";
                                toast.error("Pledge failed", { description: message });
                                throw e;
                            }
                        }}
                    />

                    <ProofUploadModal
                        isOpen={isProofUploadOpen}
                        onClose={() => setIsProofUploadOpen(false)}
                        pinId={report.id}
                    />

                    <CleanupComparisonModal
                        isOpen={isComparisonOpen}
                        onClose={() => setIsComparisonOpen(false)}
                        beforeImage={report.cleanupProof?.beforeImage || report.imageUrl || ''}
                        afterImage={report.cleanupProof?.afterImage || ''}
                        cleanerName={report.cleanupProof?.cleaner?.name || "Unknown Cleaner"}
                        cleanerAvatar={report.cleanupProof?.cleaner?.profilePic}
                        proofId={report.cleanupProof?.id || report.id}
                        upvotes={report.cleanupProof?.upvotes || 0}
                    />

                    <CivicActionShareModal
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        report={report}
                    />
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

function parseRupees(input: string): number {
    // Accept formats like: "रू 1200", "रू 1,200", "Rs 1200", "0"
    const digits = input.replace(/[^\d]/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? n : 0;
}
