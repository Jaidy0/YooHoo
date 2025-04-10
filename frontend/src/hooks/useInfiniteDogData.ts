// hooks/useInfiniteDogData.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dog, DogStatus } from '@/types/dog';
import { getDogList, DogQueryParams } from '@/api/dogs/dogs';

interface UseInfiniteDogDataParams {
  shelterId: number;
  pageSize?: number;
  initialStatus?: number[] | 'all';
  initialSearch?: string;
}

export function useInfiniteDogData({
  shelterId,
  pageSize = 6,
  initialStatus = 'all',
  initialSearch = '',
}: UseInfiniteDogDataParams) {
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [displayedDogs, setDisplayedDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // DECEASED 상태 필터링 함수
  const filterDeceasedDogs = useCallback((dogs: Dog[]) => {
    return dogs.filter((dog) => dog.status !== DogStatus.DECEASED);
  }, []);

  // status 파라미터 변환 함수
  const convertStatus = (
    statusParam: number[] | 'all' | undefined
  ): number[] | undefined => {
    if (statusParam === 'all' || statusParam === undefined) {
      return undefined;
    }
    return statusParam;
  };

  // 모든 강아지 데이터 한번에 가져오기
  const fetchAllDogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: DogQueryParams = {
        // 페이지네이션 사용하지 않고 전체 데이터 요청
        size: 1000, // 충분히 큰 수로 설정
        status: convertStatus(initialStatus),
        search: initialSearch || undefined,
      };
      const response = await getDogList(shelterId, params);
      const dogs = response.data || [];

      // 여기서 DECEASED 상태의 강아지를 필터링
      const filteredDogs = filterDeceasedDogs(dogs);

      setAllDogs(filteredDogs);

      // 첫 페이지만 보여주기
      setDisplayedDogs(filteredDogs.slice(0, pageSize));

      // 더 보여줄 데이터가 있는지 확인
      setHasMore(filteredDogs.length > pageSize);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [shelterId, pageSize, initialStatus, initialSearch]);

  // 더보기 버튼 클릭시 다음 페이지 데이터 보여주기
  const loadMore = useCallback(() => {
    if (hasMore) {
      const nextPage = currentPage + 1;
      const nextIndex = (nextPage + 1) * pageSize;

      // 다음 페이지 데이터 추가하기
      setDisplayedDogs(allDogs.slice(0, nextIndex));

      // 더 보여줄 데이터가 있는지 확인
      setHasMore(allDogs.length > nextIndex);

      setCurrentPage(nextPage);
    }
  }, [allDogs, currentPage, hasMore, pageSize]);

  // 필터 변경 시 데이터 재설정
  const resetFilter = useCallback(
    async (newStatus?: number[] | 'all', newSearch?: string) => {
      setIsLoading(true);
      setError(null);
      setCurrentPage(0);

      try {
        const params: DogQueryParams = {
          size: 1000,
          status: convertStatus(
            newStatus !== undefined ? newStatus : initialStatus
          ),
          search:
            (newSearch !== undefined ? newSearch : initialSearch) || undefined,
        };

        const response = await getDogList(shelterId, params);
        const dogs = response.data || [];

        // DECEASED 상태의 강아지 필터링
        const filteredDogs = filterDeceasedDogs(dogs);
        setAllDogs(filteredDogs);
        setDisplayedDogs(filteredDogs.slice(0, pageSize));
        setHasMore(filteredDogs.length > pageSize);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [shelterId, pageSize, initialStatus, initialSearch]
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchAllDogs();
  }, [fetchAllDogs]);

  return {
    dogs: displayedDogs, // 화면에 보여줄 강아지 데이터
    currentPage,
    setCurrentPage,
    isLoading,
    error,
    hasMore,
    loadMore,
    resetFilter,
  };
}
