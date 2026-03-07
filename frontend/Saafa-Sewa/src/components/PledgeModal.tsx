import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export type PledgeModalProps = {
  isOpen: boolean;
  userBalance: number;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
  initialAmount?: number;
};

const quickAmounts = [50, 100, 500] as const;

export default function PledgeModal({
  isOpen,
  userBalance,
  onClose,
  onSubmit,
  initialAmount,
}: PledgeModalProps) {
  const minAmount = 10;

  const safeBalance = Number.isFinite(userBalance) ? userBalance : 0;
  const maxAmount = Math.min(1000, Math.max(minAmount, safeBalance));

  const [amount, setAmount] = useState(() =>
    clamp(initialAmount ?? minAmount, minAmount, maxAmount),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAmount(clamp(initialAmount ?? minAmount, minAmount, maxAmount));
  }, [isOpen, initialAmount, maxAmount]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const canPledge = safeBalance >= minAmount;
  const sliderDisabled = !canPledge || isSubmitting;

  const handleSubmit = async () => {
    if (!canPledge || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(amount);
      onClose();
    } finally {
      setIsSubmitting(false);
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            className="fixed inset-0 z-[2001] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Back this Cleanup Effort"
              onClick={(e) => e.stopPropagation()}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                    restDelta: 0.001,
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                  transition: { duration: 0.15, ease: "easeOut" },
                },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Pledge
                    </p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Back this Cleanup Effort
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 inline-flex bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  Note: This amount will be deducted directly from your current wallet balance.
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="text-4xl font-black tracking-tight text-[#005A32]">
                      ₹ {canPledge ? amount : 0}
                    </h2>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Wallet
                      </p>
                      <p className="text-sm font-bold text-slate-700">₹ {userBalance}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <input
                      type="range"
                      min={minAmount}
                      max={Math.max(minAmount, maxAmount)}
                      value={clamp(amount, minAmount, Math.max(minAmount, maxAmount))}
                      disabled={sliderDisabled}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full accent-[#005A32] disabled:opacity-50"
                    />
                    <div className="mt-2 flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>₹ {minAmount}</span>
                      <span>₹ {maxAmount}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {quickAmounts.map((q) => {
                      const disabled = q > maxAmount || !canPledge || isSubmitting;
                      const active = amount === q;
                      return (
                        <button
                          key={q}
                          type="button"
                          disabled={disabled}
                          onClick={() => setAmount(clamp(q, minAmount, maxAmount))}
                          className={[
                            "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                            disabled
                              ? "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed"
                              : active
                                ? "bg-[#005A32] text-white border-[#005A32]"
                                : "bg-white text-slate-700 border-slate-200 hover:border-[#005A32]/30 hover:bg-emerald-50",
                          ].join(" ")}
                        >
                          ₹{q}
                        </button>
                      );
                    })}
                  </div>

                  {!canPledge && (
                    <p className="mt-4 text-sm text-slate-600">
                      You need at least <span className="font-bold">₹ {minAmount}</span> in your wallet to
                      pledge.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canPledge || isSubmitting}
                  className={[
                    "w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    !canPledge || isSubmitting
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-[#005A32] text-white shadow-xl shadow-emerald-900/10 hover:brightness-110",
                  ].join(" ")}
                >
                  {isSubmitting && <Spinner />}
                  Pledge ₹{canPledge ? amount : 0} Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin"
      aria-hidden="true"
    />
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

