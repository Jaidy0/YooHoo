'use client';

import { useSearchParams } from 'next/navigation';
import { useAuthGuard } from '@/components/auth/AuthGuard/AuthGuard';
import DonationForm from '@/components/donations/DonationForm/DonationForm';

export default function DonatePage() {
  const isAuthenticated = useAuthGuard();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 shelterId와 dogId 추출
  const shelterId = searchParams.get('shelterId');
  const dogId = searchParams.get('dogId');

  if (!isAuthenticated) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <>
      <DonationForm
        initialShelterId={shelterId ? Number(shelterId) : undefined}
        initialDogId={dogId ? Number(dogId) : undefined}
      />
    </>
  );
}
