import { useState, useEffect } from 'react';
import { fetchShelters } from '@/lib/api';
import { getRecentDonatedShelters } from '@/api/shelter/shelter';
import { Shelter } from '@/types/shelter';

type SortType = 'dogcount' | 'reliability';

// 최근 후원한 단체 응답 타입 정의
interface RecentDonatedShelter {
  shelterName: string;
  fileUrl: string;
}

export const useDonationShelterList = (sort: SortType = 'dogcount') => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [recentDonations, setRecentDonations] = useState<
    RecentDonatedShelter[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 병렬로 API 호출
      const [sheltersData, recentData] = await Promise.all([
        fetchShelters(sort),
        getRecentDonatedShelters(),
      ]);

      // 최근 후원한 단체 이름 목록
      const recentShelterNames = recentData.map(
        (item: RecentDonatedShelter) => item.shelterName
      );

      // 단체 목록에 isRecent 속성 추가
      const updatedShelters = sheltersData.map((shelter) => ({
        ...shelter,
        isRecent: recentShelterNames.includes(shelter.name),
      }));

      setShelters(updatedShelters);
      setRecentDonations(recentData);
    } catch (err) {
      setError('보호소 목록을 가져오는데 실패했습니다.');
      console.error('보호소 목록 로딩 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sort]);

  const refreshData = () => {
    fetchData();
  };

  return {
    shelters,
    recentDonations,
    isLoading,
    error,
    refreshData,
  };
};
