'use client';

import { useEffect, useState } from 'react';
import { useShelterFinance } from '@/hooks/useShelterFinance';
import { initializeAndSaveWithdrawal } from '@/api/donations/donation';

interface UseAdminDataInitializerResult {
  isInitialized: boolean;
  isSaving: boolean;
  error: Error | null;
  forceInitialize: () => Promise<unknown>;
}

export function useAdminDataInitializer(
  shelterId: number
): UseAdminDataInitializerResult {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFinInfoInitialized, setIsFinInfoInitialized] = useState(false);
  const [finInfoError, setFinInfoError] = useState<Error | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // shelterId가 정의되지 않은 경우 0으로 설정
  const safeShelterId = shelterId ?? 0;

  // shelterId가 0이면 사용자가 인증되지 않았거나 관리자가 아님
  const shouldInitialize = safeShelterId > 0;

  const { saveWithdrawal, isSaving, saveError } = useShelterFinance(
    shouldInitialize ? safeShelterId : 0
  );

  // 데이터 초기화 함수
  const initializeData = async () => {
    console.log('[서버] 데이터 초기화 시작');

    // 세션 스토리지 키
    const storageKey = `adminDataInitialized_${safeShelterId}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isAlreadyInitialized = sessionStorage.getItem(storageKey);

    try {
      setFinInfoError(null);

      // API 호출 시도
      if (typeof saveWithdrawal === 'function') {
        console.log('[서버] saveWithdrawal 함수 호출');
        const withdrawalResult = await saveWithdrawal();
        console.log('[서버] saveWithdrawal 결과:', withdrawalResult);
      } else {
        // saveWithdrawal 함수가 없으면 직접 API 호출
        console.log('[서버] initializeAndSaveWithdrawal 직접 호출');
        await initializeAndSaveWithdrawal({ shelterId: safeShelterId });
        console.log('[서버] initializeAndSaveWithdrawal 호출 완료');
      }

      // 초기화 완료 표시
      sessionStorage.setItem(storageKey, 'true');
      setIsFinInfoInitialized(true);
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('[서버] 초기화 오류:', error);
      if (error instanceof Error) {
        setFinInfoError(error);
      } else {
        setFinInfoError(new Error('데이터 초기화 중 오류가 발생했습니다.'));
      }
      return false;
    }
  };

  // 강제 초기화 함수 (UI에서 호출 가능)
  const forceInitialize = async () => {
    // 세션 스토리지 초기화
    const storageKey = `adminDataInitialized_${safeShelterId}`;
    sessionStorage.removeItem(storageKey);

    // 강제 업데이트를 통한 useEffect 재실행
    setForceUpdate((prev) => prev + 1);

    // 초기화 로직 직접 실행
    return initializeData();
  };

  // 메인 초기화 로직
  useEffect(() => {
    // 인증 완료 및 유효한 보호소 ID가 있을 때만 초기화
    if (!shouldInitialize) {
      console.log('[서버] 초기화 건너뜀: 유효하지 않은 보호소 ID');
      setIsInitialized(true);
      setIsFinInfoInitialized(true);
      return;
    }

    console.log('[서버] 초기화 로직 실행, shelterId:', safeShelterId);

    // 항상 API 호출이 필요하다면 아래 주석을 해제하여 사용하세요
    // const storageKey = `adminDataInitialized_${safeShelterId}`;
    // sessionStorage.removeItem(storageKey);

    initializeData();
  }, [saveWithdrawal, safeShelterId, shouldInitialize, forceUpdate]);

  return {
    isInitialized: isInitialized && isFinInfoInitialized,
    isSaving,
    error: saveError || finInfoError,
    forceInitialize,
  };
}
