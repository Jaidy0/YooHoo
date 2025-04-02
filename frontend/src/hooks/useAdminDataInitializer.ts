// src/hooks/useAdminDataInitializer.ts (디버깅 로그 추가)
import { useEffect, useState } from 'react';
import { useShelterFinance } from '@/hooks/useShelterFinance';
import { initializeShelterFinInfo } from '@/api/donations/donation';

export function useAdminDataInitializer(shelterId: number) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFinInfoInitialized, setIsFinInfoInitialized] = useState(false);
  const [finInfoError, setFinInfoError] = useState<Error | null>(null);

  console.log('[디버깅] useAdminDataInitializer 호출됨, shelterId:', shelterId);

  const { saveWithdrawal, isSaving, saveError } = useShelterFinance(shelterId);

  console.log('[디버깅] useShelterFinance 결과:', { isSaving, saveError });

  useEffect(() => {
    console.log('[디버깅] useEffect 실행됨, shelterId:', shelterId);
    const isAlreadyInitialized = sessionStorage.getItem('adminDataInitialized');
    console.log('[디버깅] 세션 스토리지 값:', isAlreadyInitialized);

    async function initializeData() {
      console.log('[디버깅] initializeData 함수 실행');
      if (!isAlreadyInitialized) {
        console.log('[디버깅] 데이터 초기화 시작');
        try {
          // 1. 입출금 내역 업데이트
          console.log('[디버깅] saveWithdrawal 호출 전');
          console.log('[디버깅] saveWithdrawal 타입:', typeof saveWithdrawal);
          await saveWithdrawal(shelterId);
          console.log('[디버깅] saveWithdrawal 완료');

          // 2. 재정 정보 초기화 요청
          console.log('[디버깅] initializeShelterFinInfo 호출 전');
          await initializeShelterFinInfo(shelterId);
          console.log('[디버깅] initializeShelterFinInfo 완료');

          // 두 작업이 모두 성공하면 초기화 완료로 표시
          sessionStorage.setItem('adminDataInitialized', 'true');
          console.log('[디버깅] 세션 스토리지에 초기화 상태 저장됨');
          setIsFinInfoInitialized(true);
          setIsInitialized(true);
          console.log('[디버깅] 초기화 상태 업데이트됨');
        } catch (error) {
          console.error('[디버깅] 초기화 과정 오류:', error);
          if (error instanceof Error) {
            setFinInfoError(error);
            console.error('[디버깅] 오류 메시지:', error.message);
            console.error('[디버깅] 오류 스택:', error.stack);
          } else {
            setFinInfoError(new Error('데이터 초기화 중 오류가 발생했습니다.'));
            console.error('[디버깅] 비표준 오류 객체:', error);
          }
        }
      } else {
        console.log('[디버깅] 이미 초기화됨, 상태만 업데이트');
        setIsFinInfoInitialized(true);
        setIsInitialized(true);
      }
    }

    initializeData();

    // 디버깅을 위한 정리 함수
    return () => {
      console.log('[디버깅] useEffect 정리(cleanup) 함수 실행');
    };
  }, [saveWithdrawal, shelterId]);

  console.log('[디버깅] useAdminDataInitializer 반환값:', {
    isInitialized: isInitialized && isFinInfoInitialized,
    isSaving,
    error: saveError || finInfoError,
  });

  return {
    isInitialized: isInitialized && isFinInfoInitialized,
    isSaving,
    error: saveError || finInfoError,
  };
}
