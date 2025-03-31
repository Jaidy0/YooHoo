import { useState, useEffect, useCallback } from 'react';
import { Dog } from '@/types/dog';
import { getDogList, DogQueryParams } from '@/api/dogs/dogs';

interface UseDogDataParams {
  shelterId: number;
  initialPage?: number;
  pageSize?: number;
  initialStatus?: number[] | 'all';
  initialSearch?: string;
}

interface UseDogDataResult {
  dogs: Dog[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  status: number[] | 'all';
  setStatus: (status: number[] | 'all') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 강아지 목록 데이터를 관리하는 훅
 * @param params 초기 파라미터 (보호소ID, 페이지, 페이지 크기, 상태, 검색어)
 * @returns 강아지 목록 데이터 및 상태 제어 함수들
 */
export function useDogData({
  shelterId,
  initialPage = 0,
  pageSize = 10,
  initialStatus = 'all',
  initialSearch = '',
}: UseDogDataParams): UseDogDataResult {
  // 상태 관리
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [status, setStatus] = useState<number[] | 'all'>(initialStatus);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 요청 파라미터 생성
  const getQueryParams = useCallback((): DogQueryParams => {
    const params: DogQueryParams = {
      page: currentPage,
      size: pageSize,
    };

    // 상태 필터링
    if (status !== 'all' && status.length > 0) {
      params.status = status;
    }

    // 검색어
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    return params;
  }, [currentPage, pageSize, status, searchTerm]);

  // 데이터 불러오기 함수
  const fetchDogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = getQueryParams();
      const response = await getDogList(shelterId, params);

      setDogs(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
      setTotalElements(response.total || 0);
    } catch (err) {
      console.error('강아지 목록을 불러오는 중 오류가 발생했습니다:', err);
      setError('데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
      setDogs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [shelterId, getQueryParams, pageSize]);

  // 의존성이 변경될 때마다 데이터 다시 불러오기
  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return {
    dogs,
    totalPages,
    totalElements,
    currentPage,
    setCurrentPage,
    status,
    setStatus,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    refetch: fetchDogs,
  };
}
