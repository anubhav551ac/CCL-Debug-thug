import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { X, ThumbsUp, ShieldCheck } from "lucide-react";
import { useUpvoteProof } from "@/features/pins/useProof";
import { toast } from "sonner";

interface CleanupComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    beforeImage: string;
    afterImage: string;
    cleanerName: string;
    cleanerAvatar?: string;
    proofId: string;
    upvotes?: number;
}

const SPRING = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 };

export default function CleanupComparisonModal({
    isOpen,
    onClose,
    beforeImage,
    afterImage,
    cleanerName,
    cleanerAvatar,
    proofId,
    upvotes = 0,
}: CleanupComparisonModalProps) {
    const [position, setPosition] = useState(50);
    const [showLabels, setShowLabels] = useState(true);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [proofUpvotes, setProofUpvotes] = useState(0);
    
    // Sync initial upvotes when modal opens
    useEffect(() => {
        if (isOpen) {
            setProofUpvotes(upvotes);
        }
    }, [isOpen, upvotes]);

    const upvoteProof = useUpvoteProof();

    // Auto-swipe animation on mount
    useEffect(() => {
        if (!isOpen) {
            setPosition(50);
            setShowLabels(true);
            setHasUserInteracted(false);
            return;
        }

        const steps = [
            { pos: 0, delay: 0 },
            { pos: 100, delay: 800 },
            { pos: 50, delay: 1600 },
        ];

        const timers: ReturnType<typeof setTimeout>[] = [];

        steps.forEach(({ pos, delay }) => {
            timers.push(setTimeout(() => setPosition(pos), delay));
        });

        return () => timers.forEach(clearTimeout);
    }, [isOpen]);

    const handlePositionChange = useCallback(
        (pos: number) => {
            setPosition(pos);
            if (!hasUserInteracted) {
                setHasUserInteracted(true);
                setShowLabels(false);
            }
        },
        [hasUserInteracted]
    );

    const handleUpvote = async () => {
        try {
            const data = await upvoteProof.mutateAsync(proofId);
            setProofUpvotes((prev) => prev + 1);
            
            // Auto close if this upvote resolved the pin
            if (data.isNewlyResolved) {
                onClose();
            }
        } catch {
            toast.error("Failed to upvote proof");
        }
    };

    // Esc to close
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-[2001] flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Cleanup Proof Comparison"
                            onClick={(e) => e.stopPropagation()}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9, y: 20 },
                                visible: { opacity: 1, scale: 1, y: 0, transition: SPRING },
                                exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-5xl rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 border-2 border-emerald-300 shrink-0">
                                        {cleanerAvatar ? (
                                            <img src={cleanerAvatar} alt={cleanerName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-emerald-600">
                                                {cleanerName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{cleanerName}</p>
                                        <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                                            <ShieldCheck size={10} className="text-emerald-500" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                                                Verified Cleanup
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Comparison Slider */}
                            <div className="relative w-full aspect-[16/9] bg-slate-900">
                                <ReactCompareSlider
                                    position={position}
                                    onPositionChange={handlePositionChange}
                                    itemOne={
                                        <ReactCompareSliderImage
                                            src={beforeImage}
                                            alt="Before cleanup"
                                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                        />
                                    }
                                    itemTwo={
                                        <ReactCompareSliderImage
                                            src={afterImage}
                                            alt="After cleanup"
                                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                        />
                                    }
                                    style={{ width: "100%", height: "100%" }}
                                />

                                {/* Floating Labels */}
                                <AnimatePresence>
                                    {showLabels && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest pointer-events-none z-10"
                                            >
                                                Before
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest pointer-events-none z-10"
                                            >
                                                After
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="p-6 flex items-center justify-between border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-medium">
                                    Drag the slider to compare before and after
                                </p>
                                <div className="flex items-center gap-3">
                                    {/* Upvote Counter */}
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <ThumbsUp size={14} className="fill-emerald-200" />
                                        <span className="text-xs font-black">{proofUpvotes}</span>
                                    </div>

                                    {/* Upvote Action Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleUpvote}
                                        disabled={upvoteProof.isPending}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
                                    >
                                        <ThumbsUp size={16} />
                                        Upvote Proof
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
