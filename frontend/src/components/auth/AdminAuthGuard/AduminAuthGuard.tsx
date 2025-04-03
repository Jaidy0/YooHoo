// src/components/auth/AdminAuthGuard.tsx
'use client';
import React from 'react';
import { useAuthGuard } from '@/components/auth/AuthGuard/AuthGuard';
import { useAdminDataInitializer } from '@/hooks/useAdminDataInitializer';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  shelterId: number;
}
console.log('AdminAuthGuard 파일 로드됨');

export default function AdminAuthGuard({
  children,
  shelterId,
}: AdminAuthGuardProps) {
  // 인증 확인
  const isAuthenticated = useAuthGuard('/yoohoo/login/kakao');
  console.log('AdminAuthGuard 컴포넌트 실행, shelterId:', shelterId);

  // 데이터 초기화
  const { isInitialized, error } = useAdminDataInitializer(shelterId);

  // 인증 또는 데이터 초기화 중
  if (!isAuthenticated || !isInitialized) {
    return <div className='admin-loading'>관리자 페이지 준비 중...</div>;
  }

  // 데이터 초기화 오류
  if (error) {
    return (
      <div className='admin-error'>데이터 초기화 오류: {error.message}</div>
    );
  }

  return <>{children}</>;
}
