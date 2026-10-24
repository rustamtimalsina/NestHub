export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="w-full h-56 bg-slate-200"></div>
      <div className="p-5 space-y-4">
        <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
        <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
        <div className="flex justify-between pt-3 border-t border-slate-100">
          <div className="h-4 bg-slate-100 rounded w-16"></div>
          <div className="h-4 bg-slate-100 rounded w-16"></div>
          <div className="h-4 bg-slate-100 rounded w-16"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 bg-slate-200 rounded w-28"></div>
          <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse space-y-8">
      <div className="h-[480px] bg-slate-200 rounded-3xl w-full"></div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-10 bg-slate-200 rounded-lg w-3/4"></div>
          <div className="h-5 bg-slate-100 rounded w-1/3"></div>
          <div className="h-28 bg-slate-100 rounded-2xl w-full"></div>
          <div className="h-48 bg-slate-100 rounded-2xl w-full"></div>
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-slate-100 rounded-3xl w-full"></div>
          <div className="h-44 bg-slate-100 rounded-3xl w-full"></div>
        </div>
      </div>
    </div>
  );
}
