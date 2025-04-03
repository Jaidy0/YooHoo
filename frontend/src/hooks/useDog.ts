// src/hooks/useDog.ts
import { useState, useEffect } from 'react';
import { Dog } from '@/types/dog';
import { getDogById } from '@/api/dogs/dogs';

interface UseDogResult {
  dog: Dog | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 강아지 상세 정보를 조회하는 커스텀 훅
 * @param dogId 강아지 ID
 * @returns {UseDogResult} 강아지 정보, 로딩 상태, 에러, 재조회 함수
 */
export function useDog(dogId: number | string): UseDogResult {
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ID가 문자열로 전달된 경우 숫자로 변환
  const normalizedDogId =
    typeof dogId === 'string' ? parseInt(dogId, 10) : dogId;

  const fetchDog = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dogData = await getDogById(normalizedDogId);

      setDog(dogData);
    } catch (err) {
      setError('강아지 정보를 불러오는데 실패했습니다.');
      console.error(`강아지 ID ${normalizedDogId} 조회 중 오류:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDog();
  }, [normalizedDogId]);

  // 외부에서 데이터를 다시 불러올 수 있는 함수 제공
  const refetch = async () => {
    await fetchDog();
  };

  return { dog, isLoading, error, refetch };
}
