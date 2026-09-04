export function AnalyticsSkeleton() {
  return (
    <div className="space-y-12 animate-skeleton" aria-label="Loading analytics data">
      {/* 1. Executive Performance Strip Skeleton */}
      <div className="rounded-xl border border-[#262630] bg-[#17171B] overflow-hidden">
        <div className="h-10 border-b border-[#202027] bg-[#141418] px-6 py-3">
          <div className="h-3 w-44 rounded bg-[#262630]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#202027]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 space-y-3">
              <div className="h-2.5 w-24 rounded bg-[#262630]" />
              <div className="h-9 w-32 rounded bg-[#202027]" />
              <div className="h-2 w-36 rounded bg-[#262630]" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Primary 2-Column Analytics Grid Skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Shipping Cost Trend Skeleton (Rectangular chart skeleton) */}
        <div className="rounded-xl border border-[#262630] bg-[#17171B] overflow-hidden p-6 space-y-5 h-96">
          <div className="flex items-center justify-between border-b border-[#202027] pb-4">
            <div className="space-y-1.5">
              <div className="h-3 w-36 rounded bg-[#262630]" />
              <div className="h-2 w-48 rounded bg-[#202027]" />
            </div>
            <div className="h-6 w-24 rounded bg-[#262630]" />
          </div>
          <div className="h-56 w-full rounded-lg bg-[#141418] border border-[#202027] flex items-end p-4 gap-4">
            <div className="h-16 w-full rounded bg-[#202027]/40" />
            <div className="h-28 w-full rounded bg-[#202027]/50" />
            <div className="h-36 w-full rounded bg-[#202027]/60" />
            <div className="h-24 w-full rounded bg-[#202027]/50" />
            <div className="h-44 w-full rounded bg-[#202027]/70" />
          </div>
        </div>

        {/* Order Performance Skeleton (Horizontal distribution skeleton) */}
        <div className="rounded-xl border border-[#262630] bg-[#17171B] overflow-hidden p-6 space-y-5 h-96">
          <div className="flex items-center justify-between border-b border-[#202027] pb-4">
            <div className="space-y-1.5">
              <div className="h-3 w-36 rounded bg-[#262630]" />
              <div className="h-2 w-48 rounded bg-[#202027]" />
            </div>
            <div className="h-6 w-20 rounded bg-[#262630]" />
          </div>
          <div className="h-3 w-full rounded-full bg-[#141418]" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 w-28 rounded bg-[#262630]" />
                <div className="h-3 w-14 rounded bg-[#202027]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Network & Catalog 2-Column Skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Warehouse Utilization Skeleton (Ranked rows) */}
        <div className="rounded-xl border border-[#262630] bg-[#17171B] overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202027] pb-4">
            <div className="space-y-1.5">
              <div className="h-3 w-40 rounded bg-[#262630]" />
              <div className="h-2 w-52 rounded bg-[#202027]" />
            </div>
            <div className="h-6 w-16 rounded bg-[#262630]" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-36 rounded bg-[#262630]" />
                  <div className="h-3 w-12 rounded bg-[#202027]" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#141418]" />
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Health Skeleton (Compact stock risk tiers) */}
        <div className="rounded-xl border border-[#262630] bg-[#17171B] overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202027] pb-4">
            <div className="space-y-1.5">
              <div className="h-3 w-36 rounded bg-[#262630]" />
              <div className="h-2 w-48 rounded bg-[#202027]" />
            </div>
            <div className="h-6 w-20 rounded bg-[#262630]" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-lg border border-[#262630] bg-[#141418] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 rounded bg-[#262630]" />
                  <div className="h-3 w-12 rounded bg-[#202027]" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#1C1C21]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
