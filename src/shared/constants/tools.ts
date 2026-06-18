import type { ComponentType } from 'react';
import {
  ExtractImagesIcon,
  ExtractPagesIcon,
  ImagesToPdfIcon,
  MergeIcon,
} from '@/shared/components/icons/ToolIcons';

export type ToolDefinition = {
  id: string;
  title: string;
  navTitle: string;
  description: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  accentBg: string;
};

export const TOOLS: ToolDefinition[] = [
  {
    id: 'merge',
    title: 'Juntar PDF',
    navTitle: 'Juntar PDF',
    description: 'Combine vários ficheiros PDF num único documento, na ordem que preferir.',
    path: '/merge',
    icon: MergeIcon,
    accent: 'text-blue-600',
    accentBg: 'bg-blue-50 group-hover:bg-blue-100',
  },
  {
    id: 'extract-pages',
    title: 'Extrair páginas',
    navTitle: 'Extrair páginas',
    description: 'Selecione e extraia páginas específicas de um documento PDF.',
    path: '/extract-pages',
    icon: ExtractPagesIcon,
    accent: 'text-violet-600',
    accentBg: 'bg-violet-50 group-hover:bg-violet-100',
  },
  {
    id: 'extract-images',
    title: 'Extrair imagens',
    navTitle: 'Extrair imagens',
    description: 'Extraia imagens embutidas ou renderize páginas como ficheiros de imagem.',
    path: '/extract-images',
    icon: ExtractImagesIcon,
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-50 group-hover:bg-emerald-100',
  },
  {
    id: 'images-to-pdf',
    title: 'Imagens para PDF',
    navTitle: 'Imagens para PDF',
    description: 'Converta imagens PNG, JPEG ou WebP num documento PDF pronto a partilhar.',
    path: '/images-to-pdf',
    icon: ImagesToPdfIcon,
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50 group-hover:bg-amber-100',
  },
];

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
