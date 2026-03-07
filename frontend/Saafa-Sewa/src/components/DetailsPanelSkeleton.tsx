export type DetailsPanelSkeletonProps = {
  className?: string;
};

export default function DetailsPanelSkeleton({ className }: DetailsPanelSkeletonProps) {
  return (
    <div className={["flex flex-col h-full", className].filter(Boolean).join(" ")}>
      {/* Header Image Placeholder */}
      <div className="h-64 lg:h-72 w-full bg-gray-200 animate-pulse flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 overflow-hidden p-8 space-y-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between py-6 border-y border-slate-100">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Staggered lines (dense but scannable) */}
        <div className="space-y-6">
          <SkeletonRow labelWidth="w-28" valueWidth="w-64" />
          <SkeletonRow labelWidth="w-24" valueWidth="w-56" />
          <SkeletonRow labelWidth="w-32" valueWidth="w-40" />

          {/* Bounty Pool Card Placeholder */}
          <div className="p-6 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse mt-2" />
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-8 bg-slate-50 border-t border-slate-100 flex-shrink-0">
        <div className="h-12 w-full rounded-xl bg-gray-300 animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonRow({
  labelWidth,
  valueWidth,
}: {
  labelWidth: string;
  valueWidth: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className={["h-2.5 rounded bg-gray-200 animate-pulse", labelWidth].join(" ")} />
        <div className={["h-4 rounded bg-gray-200 animate-pulse", valueWidth].join(" ")} />
        <div className="h-3 w-44 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

