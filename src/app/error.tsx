'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offwhite px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6 text-brand-terracotta">✕</div>
        <h2 className="font-display text-2xl font-bold text-brand-graphite mb-4">
          Algo deu errado
        </h2>
        <p className="text-brand-gray mb-8 leading-relaxed">
          Não foi possível carregar esta página. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-brand-terracotta text-white px-8 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase rounded border-none cursor-pointer transition-all hover:bg-brand-terracotta-dark"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="bg-transparent border-2 border-brand-terracotta text-brand-terracotta px-8 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase rounded no-underline transition-all hover:bg-brand-terracotta hover:text-white"
          >
            Página inicial
          </a>
        </div>
      </div>
    </div>
  );
}
