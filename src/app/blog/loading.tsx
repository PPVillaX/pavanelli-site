export default function BlogLoading() {
  return (
    <div className="px-6 md:px-[60px] py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-brand-cream rounded w-48 mb-8" />
      {/* 3 card skeletons */}
      {[1, 2, 3].map(i => (
        <div key={i} className="mb-8 border-b border-brand-cream pb-8">
          <div className="h-48 bg-brand-cream rounded mb-4" />
          <div className="h-5 bg-brand-cream rounded w-3/4 mb-2" />
          <div className="h-4 bg-brand-cream rounded w-1/2 mb-2" />
          <div className="h-4 bg-brand-cream rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
