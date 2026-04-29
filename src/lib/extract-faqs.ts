/**
 * Extrai perguntas frequentes do HTML de um post de blog.
 *
 * Convenção de conteúdo (Tiptap): a seção começa em um <h2> contendo
 * "Perguntas frequentes" (case-insensitive). Cada pergunta é um <h3>;
 * o conteúdo entre dois <h3> consecutivos (ou entre o último <h3> e o
 * próximo <h2>) é a resposta.
 *
 * Retorna um array vazio se nenhuma seção for encontrada, permitindo
 * uso seguro com `if (faqs.length > 0) renderFAQPageSchema()`.
 */
export interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_HEADING_REGEX = /perguntas\s+frequentes/i;

export function extractFAQs(html: string | null | undefined): FAQItem[] {
  if (!html) return [];

  // 1. Localiza o índice do <h2> que abre a seção de FAQ.
  const h2OpenRegex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let faqSectionStart = -1;
  let match: RegExpExecArray | null;
  while ((match = h2OpenRegex.exec(html)) !== null) {
    const headingText = stripTags(match[1]).trim();
    if (FAQ_HEADING_REGEX.test(headingText)) {
      faqSectionStart = match.index + match[0].length;
      break;
    }
  }
  if (faqSectionStart === -1) return [];

  // 2. Localiza onde a seção termina (próximo <h2> ou fim do conteúdo).
  const nextH2 = html.slice(faqSectionStart).search(/<h2[\s>]/i);
  const faqSectionEnd =
    nextH2 === -1 ? html.length : faqSectionStart + nextH2;

  const section = html.slice(faqSectionStart, faqSectionEnd);

  // 3. Extrai pares <h3>pergunta</h3> + conteúdo seguinte como resposta.
  const items: FAQItem[] = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const positions: { question: string; start: number; end: number }[] = [];

  let h3Match: RegExpExecArray | null;
  while ((h3Match = h3Regex.exec(section)) !== null) {
    positions.push({
      question: stripTags(h3Match[1]).trim(),
      start: h3Match.index,
      end: h3Match.index + h3Match[0].length,
    });
  }

  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    const next = positions[i + 1];
    const answerHtml = section.slice(current.end, next ? next.start : undefined);
    const answer = stripTags(answerHtml).replace(/\s+/g, ' ').trim();
    if (current.question && answer) {
      items.push({ question: current.question, answer });
    }
  }

  return items;
}

/**
 * Remove tags HTML, deixando apenas o texto. Conserva quebras de linha
 * básicas (<br>) como espaço, e descodifica entidades HTML mais comuns.
 */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

/**
 * Constrói o objeto FAQPage JSON-LD a partir de um array de FAQs.
 * Use somente quando `faqs.length > 0`.
 */
export function buildFAQPageJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
