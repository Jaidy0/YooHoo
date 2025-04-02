// src/hooks/useAdminDataInitializer.ts
import { useEffect, useState } from 'react';
import { useShelterFinance } from '@/hooks/useShelterFinance';
import { initializeShelterFinInfo } from '@/api/donations/donation';

export function useAdminDataInitializer(shelterId: number) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFinInfoInitialized, setIsFinInfoInitialized] = useState(false);
  const [finInfoError, setFinInfoError] = useState<Error | null>(null);

  const { saveWithdrawal, isSaving, saveError } = useShelterFinance(shelterId);

  useEffect(() => {
    const isAlreadyInitialized = sessionStorage.getItem('adminDataInitialized');

    async function initializeData() {
      if (!isAlreadyInitialized) {
        try {
          // 1. 입출금 내역 업데이트
          await saveWithdrawal(shelterId);

          // 2. 재정 정보 초기화 요청
          await initializeShelterFinInfo(shelterId);

          // 두 작업이 모두 성공하면 초기화 완료로 표시
          sessionStorage.setItem('adminDataInitialized', 'true');
          setIsFinInfoInitialized(true);
          setIsInitialized(true);
        } catch (error) {
          if (error instanceof Error) {
            setFinInfoError(error);
          } else {
            setFinInfoError(new Error('데이터 초기화 중 오류가 발생했습니다.'));
          }
          console.error('관리자 데이터 초기화 실패:', error);
        }
      } else {
        setIsFinInfoInitialized(true);
        setIsInitialized(true);
      }
    }

    initializeData();
  }, [saveWithdrawal, shelterId]);

  return {
    isInitialized: isInitialized && isFinInfoInitialized,
    isSaving,
    error: saveError || finInfoError,
  };
}
