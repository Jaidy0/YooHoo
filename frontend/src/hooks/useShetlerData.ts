import { useState, useEffect } from 'react';
import {
  getShelterDetail,
  getDogCountByShelter,
  getShelterReliability,
} from '@/api/shelter/shelter';
import { ShelterDetail } from '@/types/shelter';

/**
 * 보호소 정보와, 보호 중인 강아지 수 데이터를 가져오는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 로딩 상태, 보호소 정보, 강아지 상태별 개수, 에러 상태, 새로고침 함수
 */
// 강아지 수 타입 정의
interface DogCount {
  adoption: number; // 입양된 강아지 수
  protection: number; // 보호 중인 강아지 수
  rescue: number; // 구조된 강아지 수
}

export const useShelterData = (shelterId: number) => {
  const [shelter, setShelter] = useState<ShelterDetail | null>(null);
  const [dogCount, setDogCount] = useState<DogCount>({
    adoption: 0,
    protection: 0,
    rescue: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 신뢰지수 API를 포함하여 병렬로 실행
      const [shelterData, dogCountData, reliabilityData] = await Promise.all([
        getShelterDetail(shelterId),
        getDogCountByShelter(shelterId),
        getShelterReliability(shelterId),
      ]);

      // shelterData에 신뢰지수 정보 추가
      const shelterWithReliability = {
        ...shelterData,
        reliability: reliabilityData.reliabilityScore,
        dogScore: reliabilityData.dogScore,
        fileScore: reliabilityData.fileScore,
        foundationScore: reliabilityData.foundationScore,
      };

      console.log('shelterWithReliability : ', shelterWithReliability);

      setShelter(shelterWithReliability);
      setDogCount(dogCountData);
    } catch (err) {
      setError('보호소 정보를 가져오는데 실패했습니다.');
      console.error('보호소 데이터 로딩 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 shelterId 변경 시 데이터 가져오기
  useEffect(() => {
    if (shelterId) {
      fetchData();
    }
  }, [shelterId]);

  // 데이터 새로고침 함수
  const refreshData = () => {
    fetchData();
  };

  // 상태별 강아지 수와 총 강아지 수 계산
  const totalDogCount =
    dogCount.adoption + dogCount.protection + dogCount.rescue;

  return {
    shelter,
    dogCount,
    totalDogCount,
    isLoading,
    error,
    refreshData,
  };
};
