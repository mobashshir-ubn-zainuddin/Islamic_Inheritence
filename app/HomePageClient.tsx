'use client';

import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('./HomeContent'), {
  loading: () => null,
  ssr: false,
});

export default function HomePageClient() {
  return <HomeContent />;
}
