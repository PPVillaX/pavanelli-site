import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-[480px]">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
          Erro 404
        </div>
        <h1 className="font-display text-[64px] md:text-[96px] font-bold text-brand-graphite leading-none mb-4 tracking-tight">
          404
        </h1>
        <p className="text-lg text-brand-gray font-light mb-10 leading-relaxed">
          A página que você procura não foi encontrada. Ela pode ter sido movida ou o endereço está incorreto.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="inline-block bg-brand-terracotta text-white px-8 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta-dark"
          >
            Início
          </Link>
          <Link
            href="/portfolio"
            className="inline-block border-2 border-brand-graphite text-brand-graphite px-8 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-graphite hover:text-white"
          >
            Portfólio
          </Link>
          <Link
            href="/contato"
            className="inline-block text-brand-terracotta text-[13px] font-semibold tracking-[0.1em] uppercase no-underline border-b-2 border-brand-terracotta pb-0.5 transition-colors hover:opacity-70"
          >
            Contato
          </Link>
        </div>
      </div>
    </section>
  );
}
