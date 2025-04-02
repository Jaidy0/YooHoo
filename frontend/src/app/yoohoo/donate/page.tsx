'use client';

import { useAuthGuard } from '@/components/auth/AuthGuard/AuthGuard';
import DonationForm from '@/components/donations/DonationForm/DonationForm';

export default function DonatePage() {
  // const isAuthenticated = useAuthGuard();

  // if (!isAuthenticated) {
  //   return null; // 또는 로딩 컴포넌트
  // }

  return (
    <>
      <DonationForm />
    </>
  );
}
