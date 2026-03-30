# Pavanelli Arquitetura — Site Institucional

Site institucional do escritório **Pavanelli Arquitetura + Interiores**, construído com Next.js 16, Supabase e Tailwind CSS v4.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Banco de dados | Supabase (PostgreSQL + pgREST) |
| Storage | Supabase Storage |
| Estilização | Tailwind CSS v4 |
| E-mail transacional | Resend |
| Analytics | Google Analytics 4 |
| Deploy | Vercel |

## Funcionalidades

- **Site público** — Home, Portfolio, Blog, Sobre, Contato
- **Admin CMS** — Gerenciamento de projetos, posts de blog, formulários de contato, configurações gerais
- **SEO completo** — JSON-LD schemas (WebSite, Person, Organization, BreadcrumbList, BlogPosting), sitemap dinâmico, robots.txt, Open Graph
- **ISR** — Revalidação automática via `/api/revalidate` ao salvar no admin
- **Responsivo** — Mobile-first com bottom nav em mobile
- **Brand customizável** — Cores primárias configuráveis via admin

## Estrutura do projeto

```
site/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── admin/              # CMS admin (autenticado via Supabase Auth)
│   │   ├── blog/               # Blog público
│   │   ├── portfolio/          # Portfolio de projetos
│   │   ├── sobre/              # Página Sobre
│   │   ├── contato/            # Página de Contato
│   │   ├── api/                # Route handlers (revalidate, contact, sitemap)
│   │   ├── layout.tsx          # Root layout com metadados e JSON-LD global
│   │   ├── page.tsx            # Home (SSR)
│   │   ├── not-found.tsx       # Página 404 customizada
│   │   ├── icon.tsx            # Favicon dinâmico
│   │   └── sitemap.ts          # Sitemap dinâmico
│   ├── components/             # Componentes reutilizáveis
│   │   ├── admin/              # Componentes de admin (forms, upload, etc.)
│   │   └── ...
│   ├── lib/
│   │   ├── queries.ts          # Queries ao Supabase (projetos, blog, etc.)
│   │   ├── settings.ts         # Configurações do site via site_settings
│   │   └── supabase.ts         # Clientes Supabase (server/browser)
│   └── proxy.ts                # Middleware: auth admin + security headers
├── supabase/
│   └── migrations/             # 11 migrations SQL
└── .env.example                # Variáveis de ambiente necessárias
```

## Configuração local

### 1. Pré-requisitos

- Node.js 20+
- Supabase CLI (`npm i -g supabase`)
- Conta no Supabase (cloud) ou Supabase local

### 2. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://pavanelliarquitetura.com.br
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=contato@pavanelliarquitetura.com.br
```

### 3. Banco de dados

Execute as migrations no Supabase:

```bash
# Com Supabase CLI apontando para o projeto cloud
supabase db push
# ou
supabase migration up
```

As migrations criam:
- `projects` e `project_images` — Portfolio
- `blog_posts` e `blog_categories` — Blog
- `contact_submissions` — Formulários
- `project_categories` — Categorias de projetos
- `site_settings` — Configurações do CMS
- RLS policies em todas as tabelas

### 4. Storage

Crie os buckets no Supabase Storage:
- `project-images` — imagens de projetos (público)
- `blog-images` — imagens de blog (público)
- `site-assets` — favicon, OG image, logo (público)

### 5. Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

O admin fica em `/admin` — requer login via Supabase Auth.

## Deploy na Vercel

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente (todas do `.env.example`)
3. Framework Preset: **Next.js**
4. Build Command: `npm run build`
5. Output Directory: `.next`

A Vercel detecta automaticamente Next.js — sem configuração adicional.

## Admin CMS

| Seção | URL |
|-------|-----|
| Dashboard | `/admin` |
| Projetos | `/admin/projetos` |
| Blog | `/admin/blog` |
| Formulários | `/admin/contatos` |
| Categorias | `/admin/categorias` |
| Mídias | `/admin/midias` |
| Analytics | `/admin/analytics` |
| Configurações | `/admin/configuracoes` |

### Criar usuário admin

No Supabase Dashboard → Authentication → Users → Invite User.
Use o e-mail do arquiteto. O login é por magic link ou senha.

## Revalidação de cache

Quando o admin salva qualquer conteúdo, o sistema chama `/api/revalidate` que limpa o cache ISR das páginas afetadas. Mudanças ficam visíveis em produção em segundos sem rebuild.

## Licença

Projeto privado — todos os direitos reservados. Pavanelli Arquitetura + Interiores.
