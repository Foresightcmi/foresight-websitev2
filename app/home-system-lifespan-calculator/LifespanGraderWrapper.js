'use client';

import dynamic from 'next/dynamic';

const LifespanGraderClient = dynamic(() => import('./LifespanGraderClient'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '24px', borderRadius: '12px', background: '#111827', color: '#d1d5db', marginBottom: '24px' }}>
      Loading interactive Georgia Home System Lifespan Grader...
    </div>
  )
});

export default function LifespanGraderWrapper() {
  return <LifespanGraderClient />;
}
