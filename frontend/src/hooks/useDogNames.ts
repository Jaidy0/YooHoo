'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDogNames } from '@/api/dogs/dogs';

interface DogName {
  dogId: number;
  name: string;
}

interface UseDogNamesResult {
  dogNames: DogName[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 강아지 이름 목록을 가져오는 훅
 */
export function useDogNames(): UseDogNamesResult {
  const [dogNames, setDogNames] = useState<DogName[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);

  // fetchDogNames를 useCallback으로 메모이제이션
  const fetchDogNames = useCallback(async () => {
    // 이미 로딩 중이면 중복 요청 방지
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getDogNames();
      setDogNames(response);
    } catch (err) {
      console.error('강아지 이름 목록을 가져오는 중 오류가 발생했습니다:', err);
      setError('강아지 목록을 불러오지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]); // isLoading에 의존성 추가

  // 초기 데이터 로드 및 요청 카운트 관리
  useEffect(() => {
    // 첫 번째 렌더링 또는 명시적인 리패치 요청 시에만 실행
    if (requestCount === 0) {
      fetchDogNames();
      setRequestCount(1); // 요청 카운트 증가
    }
  }, [fetchDogNames, requestCount]);

  // 명시적 리패치 함수 - 요청 카운트 리셋하여 새 요청 트리거
  const refetch = useCallback(async () => {
    setRequestCount(0); // 카운트 리셋하여 useEffect 트리거
  }, []);

  return {
    dogNames,
    isLoading,
    error,
    refetch,
  };
}
