import { useState, useEffect } from 'react';
import { Shelter } from '@/types/shelter';
import { fetchShelters } from '@/lib/api';

type SortType = 'dogcount' | 'reliability';

export const useShelterList = (sort: SortType = 'reliability') => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchShelters(sort);
      setShelters(data);
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
    isLoading,
    error,
    refreshData,
  };
};
