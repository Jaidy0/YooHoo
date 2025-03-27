'use client';

import { Suspense } from 'react';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import OAuthContent from './OAuthContent';

// 메인 컴포넌트
export default function OAuthRedirectHandler() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OAuthContent />
    </Suspense>
  );
}
