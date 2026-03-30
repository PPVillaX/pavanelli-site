export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-brand-cream border-t-brand-terracotta rounded-full animate-spin mb-4" />
        <p className="text-sm text-brand-gray tracking-[0.1em] uppercase">Carregando...</p>
      </div>
    </div>
  );
}
