import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import { X, Upload, FileImage, Loader2 } from "lucide-react";
import { useUploadProofImage } from "@/features/pins/useProof";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ProofUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    pinId: string;
}

const SPRING = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 };

export default function ProofUploadModal({
    isOpen,
    onClose,
    pinId,
}: ProofUploadModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const uploadProof = useUploadProofImage();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
        maxFiles: 1,
        disabled: isUploading,
    });

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setPreview(null);
            setDescription("");
            setIsUploading(false);
        }
    }, [isOpen]);

    // Esc to close
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isUploading) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose, isUploading]);

    // Lock body scroll
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!preview || isUploading) return;

        setIsUploading(true);

        // Simulate a slight delay for the scan animation to show
        await new Promise((r) => setTimeout(r, 2000));

        try {
            await uploadProof.mutateAsync({
                pinId,
                afterImage: preview,
                description: description.trim() || undefined,
            });

            // 🎉 Confetti
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"],
            });

            toast.success("Proof Submitted for Verification ✓", {
                description: "Community members will now verify your cleanup.",
            });

            onClose();
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Upload failed";
            toast.error("Submission Failed", { description: msg });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-md"
                        onClick={() => !isUploading && onClose()}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-[2001] flex items-center justify-center p-4"
                        onClick={() => !isUploading && onClose()}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Upload Cleanup Proof"
                            onClick={(e) => e.stopPropagation()}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9, y: 20 },
                                visible: { opacity: 1, scale: 1, y: 0, transition: SPRING },
                                exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-lg rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Proof Upload
                                        </p>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                            Submit Cleanup Evidence
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => !isUploading && onClose()}
                                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Dropzone */}
                                <div className="mt-6">
                                    {!preview ? (
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                                isDragActive
                                                    ? "border-emerald-400 bg-emerald-50"
                                                    : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
                                            }`}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                                <Upload size={24} className="text-emerald-500" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 mb-1">
                                                {isDragActive
                                                    ? "Drop the image here..."
                                                    : "Drag & drop your \"After\" photo here"}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                PNG, JPG, WEBP accepted
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                                            <img
                                                src={preview}
                                                alt="Cleanup proof preview"
                                                className="w-full h-56 object-cover"
                                            />

                                            {/* AI Laser Scan Effect */}
                                            {isUploading && (
                                                <motion.div
                                                    initial={{ top: "0%" }}
                                                    animate={{ top: ["0%", "100%", "0%"] }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                    className="absolute left-0 right-0 h-1 z-10 pointer-events-none"
                                                    style={{
                                                        background:
                                                            "linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)",
                                                        boxShadow:
                                                            "0 0 20px 4px rgba(16, 185, 129, 0.6), 0 0 60px 8px rgba(16, 185, 129, 0.3)",
                                                    }}
                                                />
                                            )}

                                            {/* Overlay during upload */}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm">
                                                        <Loader2 size={14} className="text-emerald-400 animate-spin" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                                                            AI Verification Scan
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Change photo button */}
                                            {!isUploading && (
                                                <button
                                                    onClick={() => setPreview(null)}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}

                                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                                                <FileImage size={10} className="text-white" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white">
                                                    After Photo
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mt-4">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                        Cleanup Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isUploading}
                                        placeholder="Describe what was cleaned and how..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="p-6 pt-0">
                                <motion.button
                                    whileTap={!isUploading && preview ? { scale: 0.98 } : {}}
                                    onClick={handleSubmit}
                                    disabled={!preview || isUploading}
                                    className={[
                                        "w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                        !preview || isUploading
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 cursor-pointer",
                                    ].join(" ")}
                                >
                                    {isUploading && <Loader2 size={16} className="animate-spin" />}
                                    {isUploading ? "Scanning & Uploading..." : "Submit Proof for Verification"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
