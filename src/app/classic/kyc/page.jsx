'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const KYCComponent = dynamic(() => import('./KYCComponent'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function KYC() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KYCComponent />
    </Suspense>
  );
}
