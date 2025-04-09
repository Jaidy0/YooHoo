'use client';

import { Suspense } from 'react';
import DonationForm from '@/components/donations/DonationForm/DonationForm';
import { useAuthGuard } from '@/components/auth/AuthGuard/AuthGuard';
import { useSearchParams } from 'next/navigation';

// useSearchParams()를 사용하는 컴포넌트를 별도로 분리
function DonationContent() {
  // const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 shelterId와 dogId 추출
  const shelterId = searchParams?.get('shelterId');
  const dogId = searchParams?.get('dogId');

  return (
    <DonationForm
      initialShelterId={shelterId ? Number(shelterId) : undefined}
      initialDogId={dogId ? Number(dogId) : undefined}
    />
  );
}

export default function DonatePage() {
  const isAuthenticated = useAuthGuard();

  if (!isAuthenticated) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DonationContent />
    </Suspense>
  );
}
