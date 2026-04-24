# ⚡ EquipaTech — Catálogo de Equipamentos Internos

Sistema de solicitação de equipamentos eletrônicos para funcionários, com painel admin e disparo de e-mail automático.

---

## 🗂 Estrutura

```
/
├── src/
│   ├── components/
│   │   ├── ProductCard.tsx     # Card do produto no catálogo
│   │   ├── CartDrawer.tsx      # Gaveta do carrinho + formulário de solicitação
│   │   └── ProductModal.tsx    # Modal de criação/edição de produto (admin)
│   ├── pages/
│   │   ├── CatalogPage.tsx     # Catálogo público (rota /)
│   │   ├── AdminPage.tsx       # Painel admin com CRUD (rota /admin)
│   │   └── LoginPage.tsx       # Login do admin (rota /admin/login)
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase + helpers CRUD
│   │   ├── email.ts            # Disparo de e-mail via Anthropic API + Gmail MCP
│   │   ├── cartContext.tsx     # Estado global do carrinho
│   │   └── mockData.ts         # Dados de exemplo para modo demo
│   └── types/index.ts          # Tipos TypeScript
├── supabase-schema.sql         # Schema + RLS + dados iniciais
└── .env.example                # Variáveis de ambiente necessárias
```

---

## 🚀 Setup em 5 passos

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`
3. Vá em **Settings → API** e copie a **Project URL** e **anon key**

### 3. Criar usuário admin

No Supabase, vá em **Authentication → Users → Add user** e crie o usuário que terá acesso ao painel `/admin`.

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
VITE_BUYER_EMAIL=compras@suaempresa.com
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Para build de produção:

```bash
npm run build
npm run preview
```

---

## 📧 Como funciona o e-mail

O envio usa a **Anthropic API + Gmail MCP**. Quando o funcionário clica em "Enviar Solicitação":

1. Os dados do formulário são enviados para `src/lib/email.ts`
2. A função chama `POST /v1/messages` com o servidor MCP do Gmail conectado
3. O modelo Claude compõe e envia o e-mail profissional automaticamente para `VITE_BUYER_EMAIL`

> **Pré-requisito**: O Gmail MCP deve estar autorizado na conta Anthropic que estará rodando o app. Se estiver usando o Claude.ai com o conector Gmail conectado, isso já funciona nativamente nos Artifacts.

---

## 🔒 Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Catálogo de produtos + carrinho |
| `/admin/login` | Público | Login do administrador |
| `/admin` | Autenticado | CRUD de produtos |

---

## 🎨 Design

- **Dark theme** industrial com acentos âmbar
- Tipografia: **Syne** (display) + **DM Mono** (dados/código)
- Animações: **Framer Motion** (cards, drawer, modais)
- Totalmente responsivo

---

## 🧩 Modo Demo

Se o Supabase não estiver configurado, o app roda automaticamente em **modo demo** com dados mock locais. Perfeito para apresentações.
