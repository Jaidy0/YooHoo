// src/hooks/useShelterData.ts
import { useState, useEffect } from 'react';
import { getShelterDetail } from '@/api/shelter/shelter';
import { ShelterDetail } from '@/types/shelter';

/**
 * 보호소 정보를 가져오는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 로딩 상태, 보호소 정보, 에러 상태, 새로고침 함수
 */
export const useShelterData = (shelterId: number) => {
  const [shelter, setShelter] = useState<ShelterDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getShelterDetail(shelterId);
      setShelter(data);
    } catch (err) {
      setError('보호소 정보를 가져오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 shelterId 변경 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, [shelterId]);

  // 데이터 새로고침 함수
  const refreshData = () => {
    fetchData();
  };

  return { shelter, isLoading, error, refreshData };
};
