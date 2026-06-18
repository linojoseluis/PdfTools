# PdfTools — Plano de Arquitetura e Implementação

Aplicação web React + TypeScript para ferramentas PDF com **processamento 100% no cliente**. Nenhum ficheiro é enviado a servidores.

---

## Stack

| Camada | Tecnologia | Motivo |
|--------|------------|--------|
| Build | **Vite 6** + `@vitejs/plugin-react` | HMR rápido, tree-shaking, ideal para PDF.js |
| Linguagem | **TypeScript 5.x** | Tipagem segura para buffers e APIs async |
| UI | **React 19** + **React Router 7** | SPA com lazy loading por ferramenta |
| Estilos | **Tailwind CSS 4** | UI consistente e produtiva |
| Manipulação PDF | **pdf-lib** | Merge, split, images→PDF |
| Render/parse PDF | **pdfjs-dist** | Thumbnails, extração de imagens |
| Preview | **react-pdf** | Componentes `<Document>` / `<Page>` |
| Upload | **react-dropzone** | Drag & drop |
| Download | **file-saver** + **jszip** | Guardar PDFs e arquivos ZIP |

### Divisão pdf-lib vs pdfjs-dist

```
Merge / Split / Images→PDF  →  pdf-lib
Extract Images / Thumbnails →  pdfjs-dist (+ fallback canvas)
Preview UI                  →  react-pdf (wrapper sobre pdfjs)
```

---

## Estrutura de pastas

```
PdfTools/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/                    # Bootstrap, router, providers
│   ├── features/               # Uma pasta por ferramenta (vertical slices)
│   │   ├── merge/
│   │   ├── extract-pages/
│   │   ├── extract-images/
│   │   └── images-to-pdf/
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── shared/
│   │   ├── components/         # layout, pdf, ui
│   │   ├── constants/tools.ts
│   │   ├── hooks/
│   │   ├── lib/pdf/            # Lógica pura (sem React)
│   │   └── types/
│   ├── styles/globals.css
│   └── main.tsx
├── PLAN.md
├── package.json
└── vite.config.ts
```

### Princípios

1. **`features/`** — cada ferramenta = página + hook + tipos. Nova ferramenta = nova pasta + rota + entrada em `tools.ts`.
2. **`shared/lib/pdf/`** — serviços testáveis, independentes de React.
3. **Sem backend** — aviso de privacidade visível no header e footer.

---

## Inicialização do projeto

```bash
# Na pasta do projeto
npm install
npm run dev      # http://localhost:5173
npm run build    # produção em dist/
```

Dependências principais já instaladas — ver `package.json`.

---

## Configuração Vite

- Alias `@/` → `src/`
- Tailwind via `@tailwindcss/vite`
- Worker PDF.js importado com `?url` em `pdfJsClient.ts` e componentes react-pdf
- `optimizeDeps.include`: `pdf-lib`, `pdfjs-dist`

---

## Infraestrutura partilhada

| Módulo | Ficheiro | Função |
|--------|----------|--------|
| Validação | `shared/lib/validation.ts` | MIME, limite 100 MB |
| Download | `shared/lib/download.ts` | `savePdf`, `saveZip` |
| pdf-lib | `shared/lib/pdf/pdfLibClient.ts` | Load + page count |
| pdfjs | `shared/lib/pdf/pdfJsClient.ts` | Worker, render canvas |
| Dropzone | `shared/components/pdf/FileDropzone.tsx` | Upload drag & drop |
| Thumbnails | `shared/components/pdf/PageThumbnail.tsx` | react-pdf |
| Hooks | `useFileReader`, `useDownload`, `useAsyncTask` | Padrão idle→processing→success/error |

---

## Ferramentas implementadas

### 1. Juntar PDFs (`/merge`)

- **Serviço:** `shared/lib/pdf/mergePdf.ts` — `copyPages` entre documentos
- **UI:** lista ordenável (↑↓), contagem de páginas, download `merged.pdf`
- **Hook:** `features/merge/useMergePdf.ts`

### 2. Extrair páginas (`/extract-pages`)

- **Serviço:** `shared/lib/pdf/extractPages.ts`
  - `extractPages(bytes, indices)` — subset num PDF
  - `splitIntoSinglePages(bytes)` — um PDF por página
  - `parsePageRange("1-3, 5")` — parser de intervalos
- **UI:** grid de thumbnails, seleção clique/shift, input de intervalo
- **Output:** PDF único ou ZIP com páginas individuais

### 3. Extrair imagens (`/extract-images`)

- **Serviço:** `shared/lib/pdf/extractImages.ts`
  - Camada A: operadores `paintImageXObject` via pdfjs
  - Camada B: fallback render página → canvas → PNG
- **UI:** toggle "incluir render", galeria, download individual ou ZIP
- **Hook:** `features/extract-images/useExtractImages.ts`

### 4. Imagens para PDF (`/images-to-pdf`)

- **Serviço:** `shared/lib/pdf/imagesToPdf.ts` — `embedPng` / `embedJpg`, WebP convertido via canvas
- **UI:** preview, reordenar imagens, download `images.pdf`

---

## Fluxo UX

```
Upload → Validar → Processar (pdf-lib/pdfjs) → Download local
         ↓
    idle → processing → success | error
```

---

## Rotas

| Rota | Componente |
|------|------------|
| `/` | HomePage |
| `/merge` | MergePage |
| `/extract-pages` | ExtractPagesPage |
| `/extract-images` | ExtractImagesPage |
| `/images-to-pdf` | ImagesToPdfPage |

Todas lazy-loaded via `React.lazy` + `Suspense`.

---

## Roadmap pós-MVP

- [ ] Web Workers para ficheiros > 20 MB
- [ ] Testes Vitest nos serviços `shared/lib/pdf/*`
- [ ] PWA offline
- [ ] i18n (pt/en)
- [ ] Comprimir PDF (pdfjs render + pdf-lib re-embed JPEG)
- [ ] Drag reorder com `@dnd-kit/core`

---

## Ordem de implementação (concluída)

1. Scaffold Vite + Tailwind + Router + Layout + Home
2. Infra partilhada
3. Images to PDF
4. Merge PDF
5. Extract Pages
6. Extract Images

---

## Comandos úteis

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção
npm run preview   # preview do build
npm run lint      # ESLint
```
