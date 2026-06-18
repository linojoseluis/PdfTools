import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/shared/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';

const MergePage = lazy(() =>
  import('@/features/merge/MergePage').then((m) => ({ default: m.MergePage })),
);
const ExtractPagesPage = lazy(() =>
  import('@/features/extract-pages/ExtractPagesPage').then((m) => ({
    default: m.ExtractPagesPage,
  })),
);
const ExtractImagesPage = lazy(() =>
  import('@/features/extract-images/ExtractImagesPage').then((m) => ({
    default: m.ExtractImagesPage,
  })),
);
const ImagesToPdfPage = lazy(() =>
  import('@/features/images-to-pdf/ImagesToPdfPage').then((m) => ({
    default: m.ImagesToPdfPage,
  })),
);

function PageLoader() {
  return <p className="text-center text-slate-500">A carregar…</p>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route
          path="merge"
          element={
            <Suspense fallback={<PageLoader />}>
              <MergePage />
            </Suspense>
          }
        />
        <Route
          path="extract-pages"
          element={
            <Suspense fallback={<PageLoader />}>
              <ExtractPagesPage />
            </Suspense>
          }
        />
        <Route
          path="extract-images"
          element={
            <Suspense fallback={<PageLoader />}>
              <ExtractImagesPage />
            </Suspense>
          }
        />
        <Route
          path="images-to-pdf"
          element={
            <Suspense fallback={<PageLoader />}>
              <ImagesToPdfPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
