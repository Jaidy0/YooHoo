'use client';

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
 * 강아지 목록 데이터를 관리하는 훅 - 클라이언트 측 페이지네이션
 */
export function useDogData({
  shelterId,
  initialPage = 0,
  pageSize = 20,
  initialStatus = 'all',
  initialSearch = '',
}: UseDogDataParams): UseDogDataResult {
  // 전체 데이터 목록 (페이지네이션 이전)
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  // 현재 페이지에 표시할 데이터
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [status, setStatus] = useState<number[] | 'all'>(initialStatus);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터링된 데이터 계산
  const getFilteredData = useCallback(() => {
    let filteredData = [...allDogs];

    // 상태 필터링
    if (status !== 'all' && Array.isArray(status) && status.length > 0) {
      filteredData = filteredData.filter((dog) => status.includes(dog.status));
    }

    // 검색어 필터링
    if (searchTerm.trim()) {
      const searchLower = searchTerm.trim().toLowerCase();
      filteredData = filteredData.filter((dog) =>
        dog.name.toLowerCase().includes(searchLower)
      );
    }

    return filteredData;
  }, [allDogs, status, searchTerm]);

  // 전체 데이터 불러오기 (API 호출)
  const fetchAllDogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // API에 페이지네이션 없이 전체 데이터 요청
      const params: DogQueryParams = {};

      console.log('[API 요청] 전체 데이터 요청');
      const response = await getDogList(shelterId, params);
      console.log('[API 응답]:', response);

      // API 응답은 항상 DogResponse 형태로 래핑됨
      const dogsArray = response.data || [];
      setAllDogs(dogsArray);
      setTotalElements(response.total || dogsArray.length);
      console.log(`[데이터 로드] 전체 ${dogsArray.length}개 데이터 로드됨`);
    } catch (err) {
      console.error('[API 호출 에러]', err);
      setError('데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
      setAllDogs([]);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [shelterId]);

  // 페이지네이션 및 필터링 적용
  const updateDisplayedDogs = useCallback(() => {
    const filteredData = getFilteredData();

    // 총 페이지 수 계산
    const calculatedTotalPages = Math.ceil(filteredData.length / pageSize);
    setTotalPages(calculatedTotalPages);
    setTotalElements(filteredData.length);

    // 현재 페이지가 유효한지 확인
    const validCurrentPage = Math.min(
      Math.max(0, currentPage),
      Math.max(0, calculatedTotalPages - 1)
    );

    // 현재 페이지에 표시할 데이터 계산
    const start = validCurrentPage * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);

    console.log(
      `[페이지네이션] 페이지 ${validCurrentPage + 1}/${calculatedTotalPages}, 전체 ${filteredData.length}개 중 ${paginatedData.length}개 표시`
    );

    setDogs(paginatedData);
  }, [getFilteredData, currentPage, pageSize]);

  // 전체 데이터 로드 (최초 1회)
  useEffect(() => {
    fetchAllDogs();
  }, [fetchAllDogs]);

  // 필터 또는 페이지 변경 시 화면 업데이트
  useEffect(() => {
    if (allDogs.length > 0) {
      updateDisplayedDogs();
    }
  }, [allDogs, currentPage, status, searchTerm, updateDisplayedDogs]);

  // 전체 데이터 다시 불러오기 함수
  const refetch = async () => {
    await fetchAllDogs();
  };

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
    refetch,
  };
}
