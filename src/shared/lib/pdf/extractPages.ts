import { PDFDocument } from 'pdf-lib';

export async function extractPages(
  sourceBytes: Uint8Array,
  pageIndices: number[],
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('Selecione pelo menos uma página.');
  }

  const source = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const pageCount = source.getPageCount();
  const validIndices = [...new Set(pageIndices)]
    .filter((i) => i >= 0 && i < pageCount)
    .sort((a, b) => a - b);

  if (validIndices.length === 0) {
    throw new Error('Nenhuma página válida selecionada.');
  }

  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, validIndices);
  pages.forEach((page) => output.addPage(page));

  return output.save();
}

export async function splitIntoSinglePages(
  sourceBytes: Uint8Array,
): Promise<{ pageNumber: number; bytes: Uint8Array }[]> {
  const source = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const results: { pageNumber: number; bytes: Uint8Array }[] = [];

  for (const index of source.getPageIndices()) {
    const bytes = await extractPages(sourceBytes, [index]);
    results.push({ pageNumber: index + 1, bytes });
  }

  return results;
}

export function parsePageRange(input: string, pageCount: number): {
  indices: number[];
  invalidTokens: string[];
} {
  const indices = new Set<number>();
  const invalidTokens: string[] = [];
  const trimmed = input.trim();

  if (!trimmed) {
    return { indices: [], invalidTokens: [] };
  }

  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const page = Number(part);
      if (page >= 1 && page <= pageCount) {
        indices.add(page - 1);
      } else {
        invalidTokens.push(part);
      }
      continue;
    }

    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start > end || start < 1 || end > pageCount) {
        invalidTokens.push(part);
        continue;
      }
      for (let page = start; page <= end; page += 1) {
        indices.add(page - 1);
      }
      continue;
    }

    invalidTokens.push(part);
  }

  return {
    indices: [...indices].sort((a, b) => a - b),
    invalidTokens,
  };
}
