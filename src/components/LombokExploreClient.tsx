'use client';

import dynamic from 'next/dynamic';

export default dynamic(
  () => import('@/components/ui/lombok-explore').then(m => m.LombokExplore),
  { ssr: false }
);
