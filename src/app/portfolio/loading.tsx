export default function PortfolioLoading() {
  return (
    <section className="px-6 md:px-[60px] py-20 md:py-[120px]">
      {/* Header skeleton */}
      <div className="h-3 w-20 bg-brand-cream rounded mb-4 animate-pulse" />
      <div className="h-10 w-72 bg-brand-cream rounded mb-6 animate-pulse" />
      <div className="h-5 w-96 bg-brand-cream rounded mb-10 animate-pulse" />

      {/* Filter skeleton */}
      <div className="flex gap-6 mb-[60px]">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-5 w-20 bg-brand-cream rounded animate-pulse" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className={`bg-brand-cream rounded animate-pulse ${
              i === 1 || i === 4 ? 'md:col-span-2 aspect-video' : 'aspect-[4/3]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
