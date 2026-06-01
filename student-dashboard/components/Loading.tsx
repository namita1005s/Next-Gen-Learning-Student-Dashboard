export default function Loading() {
  return (
    <div className="flex min-h-screen bg-black text-white" id="loading-root">
      {/* Sidebar Pulse Skeleton (desktop only) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-neutral-900 bg-neutral-950 p-6 space-y-8 animate-pulse" id="loading-sidebar-skeleton">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-800 rounded-xl" />
          <div className="w-24 h-5 bg-neutral-800 rounded-lg" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="w-full h-11 bg-neutral-800 rounded-xl" />
          <div className="w-full h-11 bg-neutral-800 rounded-xl" />
          <div className="w-full h-11 bg-neutral-800 rounded-xl" />
          <div className="w-full h-11 bg-neutral-800 rounded-xl" />
          <div className="w-full h-11 bg-neutral-800 rounded-xl" />
        </div>
        <div className="pt-32">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-800 rounded-full" />
            <div className="space-y-2">
              <div className="w-20 h-4 bg-neutral-800 rounded" />
              <div className="w-24 h-3 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pulse Skeleton */}
      <main className="flex-1 min-h-screen p-6 md:p-10 lg:p-12 overflow-y-auto space-y-8 animate-pulse" id="loading-main-skeleton">
        {/* Header bar placeholder */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-8" id="loading-header-placeholder">
          <div className="space-y-3">
            <div className="w-48 h-8 bg-neutral-900 rounded-xl" />
            <div className="w-32 h-4 bg-neutral-900 rounded" />
          </div>
          <div className="w-36 h-10 bg-neutral-900 rounded-xl" />
        </div>

        {/* 4-Column Bento Loader */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="loading-bento-grid">
          {/* Hero Tile skeleton */}
          <div className="col-span-1 lg:col-span-2 h-64 bg-neutral-900/30 border border-neutral-850 rounded-3xl p-6 lg:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-28 h-5 bg-neutral-800 rounded-full" />
              <div className="w-56 h-8 bg-neutral-800 rounded-xl" />
              <div className="w-4/5 h-4 bg-neutral-800 rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-800/40 pt-4">
              <div className="w-full h-8 bg-neutral-800 rounded-lg" />
              <div className="w-full h-8 bg-neutral-800 rounded-lg" />
              <div className="w-full h-8 bg-neutral-800 rounded-lg" />
            </div>
          </div>

          {/* Course Tile 1 skeleton */}
          <div className="h-64 bg-neutral-900/30 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-neutral-800 rounded-2xl" />
                <div className="w-12 h-5 bg-neutral-800 rounded-md" />
              </div>
              <div className="w-11/12 h-6 bg-neutral-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-neutral-800 rounded" />
              <div className="w-full h-2 bg-neutral-850 rounded-full" />
            </div>
          </div>

          {/* Course Tile 2 skeleton */}
          <div className="h-64 bg-neutral-900/30 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-neutral-800 rounded-2xl" />
                <div className="w-12 h-5 bg-neutral-800 rounded-md" />
              </div>
              <div className="w-10/12 h-6 bg-neutral-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-neutral-800 rounded" />
              <div className="w-full h-2 bg-neutral-850 rounded-full" />
            </div>
          </div>

          {/* Activity Tile skeleton */}
          <div className="col-span-1 lg:col-span-2 h-64 bg-neutral-900/30 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-36 h-6 bg-neutral-800 rounded-lg" />
              <div className="w-48 h-4 bg-neutral-850 rounded" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-52 h-24 bg-neutral-800 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="w-full h-8 bg-neutral-800 rounded-xl" />
                <div className="w-full h-8 bg-neutral-800 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Course Tile 3 skeleton */}
          <div className="h-64 bg-neutral-900/30 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-neutral-800 rounded-2xl" />
                <div className="w-12 h-5 bg-neutral-800 rounded-md" />
              </div>
              <div className="w-9/12 h-6 bg-neutral-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-neutral-800 rounded" />
              <div className="w-full h-2 bg-neutral-850 rounded-full" />
            </div>
          </div>

          {/* Course Tile 4 skeleton */}
          <div className="h-64 bg-neutral-900/30 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-neutral-800 rounded-2xl" />
                <div className="w-12 h-5 bg-neutral-800 rounded-md" />
              </div>
              <div className="w-11/12 h-6 bg-neutral-800 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-neutral-800 rounded" />
              <div className="w-full h-2 bg-neutral-850 rounded-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
