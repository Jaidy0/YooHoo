// components/ClientMswInitializer.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientMswInitializer() {
  const [mswInitialized, setMswInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'development'
      ) {
        console.log('Initializing MSW in client component...');

        try {
          const initMocks = (await import('@/mocks')).default;
          await initMocks();
          console.log('MSW initialized successfully');
          setMswInitialized(true);
        } catch (error) {
          console.error('Failed to initialize MSW:', error);
        }
      }
    };

    if (!mswInitialized) {
      initialize();
    }
  }, [mswInitialized]);

  // 렌더링에 영향을 주지 않도록 null 반환
  return null;
}
