'use client';

import { useEffect, useState } from 'react';
import { useShelterFinance } from '@/hooks/useShelterFinance';
import { initializeAndSaveWithdrawal } from '@/api/donations/donation';

interface UseAdminDataInitializerResult {
  isInitialized: boolean;
  isSaving: boolean;
  error: Error | null;
}

/**
 * 관리자 페이지 초기 데이터를 로드하는 커스텀 훅
 * @param shelterId 보호소 ID (0이면 초기화하지 않음)
 * @returns 초기화 상태 객체
 */
export function useAdminDataInitializer(
  shelterId: number
): UseAdminDataInitializerResult {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFinInfoInitialized, setIsFinInfoInitialized] = useState(false);
  const [finInfoError, setFinInfoError] = useState<Error | null>(null);

  // shelterId가 정의되지 않은 경우 0으로 설정
  const safeShelterId = shelterId ?? 5;

  console.log(
    '[디버깅] useAdminDataInitializer 호출됨, shelterId:',
    safeShelterId
  );

  // shelterId가 0이면 사용자가 인증되지 않았거나 관리자가 아님
  const shouldInitialize = safeShelterId > 0;

  const { saveWithdrawal, isSaving, saveError } = useShelterFinance(
    shouldInitialize ? safeShelterId : 0
  );

  console.log('[디버깅] useShelterFinance 결과:', {
    isSaving,
    saveError,
    shouldInitialize,
  });

  useEffect(() => {
    // 인증 완료 및 유효한 보호소 ID가 있을 때만 초기화
    if (!shouldInitialize) {
      console.log('[디버깅] 초기화 건너뜀: 유효하지 않은 보호소 ID');
      return;
    }

    console.log('[디버깅] useEffect 실행됨, shelterId:', safeShelterId);

    // 세션 스토리지에서 초기화 상태 확인
    const storageKey = `adminDataInitialized_${safeShelterId}`;
    const isAlreadyInitialized = sessionStorage.getItem(storageKey);
    console.log('[디버깅] 세션 스토리지 값:', isAlreadyInitialized);

    async function initializeData() {
      console.log('[디버깅] initializeData 함수 실행');

      // 이미 초기화된 경우 상태만 업데이트
      if (isAlreadyInitialized) {
        console.log('[디버깅] 이미 초기화됨, 상태만 업데이트');
        setIsFinInfoInitialized(true);
        setIsInitialized(true);
        return;
      }

      console.log('[디버깅] 데이터 초기화 시작');
      try {
        // 개발 환경이나 특정 조건에서는 API 호출 스킵 (필요시 주석 해제)
        if (
          process.env.NODE_ENV === 'development' &&
          process.env.NEXT_PUBLIC_SKIP_API_CALLS === 'true'
        ) {
          console.log('[디버깅] 개발 환경에서 API 호출 스킵됨');
          sessionStorage.setItem(storageKey, 'true');
          setIsFinInfoInitialized(true);
          setIsInitialized(true);
          return;
        }

        // 1. 입출금 내역 업데이트
        console.log('[디버깅] saveWithdrawal 호출 전');
        console.log('[디버깅] saveWithdrawal 타입:', typeof saveWithdrawal);
        const withdrawalResult = await saveWithdrawal();

        if (!withdrawalResult) {
          console.log('[디버깅] saveWithdrawal 실패, 진행 중단');
          throw new Error('출금 정보 저장에 실패했습니다.');
        }

        console.log('[디버깅] saveWithdrawal 완료');

        // 2. 재정 정보 초기화 요청
        console.log(
          '[디버깅] initializeAndSaveWithdrawal 호출 전, shelterId:',
          safeShelterId
        );
        await initializeAndSaveWithdrawal({ shelterId: safeShelterId });
        console.log('[디버깅] initializeAndSaveWithdrawal 완료');

        // 두 작업이 모두 성공하면 초기화 완료로 표시
        sessionStorage.setItem(storageKey, 'true');
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
    }

    // 데이터 초기화 시작
    initializeData();

    // 디버깅을 위한 정리 함수
    return () => {
      console.log('[디버깅] useEffect 정리(cleanup) 함수 실행');
    };
  }, [saveWithdrawal, safeShelterId, shouldInitialize]);

  // 초기화가 필요하지 않거나 shelterId가 유효하지 않은 경우는 스킵
  useEffect(() => {
    if (!shouldInitialize || shelterId <= 0) {
      console.log('[디버깅] 초기화 생략 - 유효하지 않은 shelterId:', shelterId);
      setIsInitialized(true);
      setIsFinInfoInitialized(true);
    }
  }, [shouldInitialize, shelterId]);

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
