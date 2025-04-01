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
 * 강아지 목록 데이터를 관리하는 훅
 */
export function useDogData({
  shelterId,
  initialPage = 0,
  pageSize = 20, // 한 페이지당 20마리로 변경
  initialStatus = 'all',
  initialSearch = '',
}: UseDogDataParams): UseDogDataResult {
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
    if (status !== 'all' && Array.isArray(status) && status.length > 0) {
      params.status = status;
      console.log('[디버깅] status 파라미터:', status);
    } else {
      console.log('[디버깅] status 파라미터 없음 (전체):', status);
    }

    // 검색어
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    console.log('[디버깅] 최종 쿼리 파라미터:', params);
    return params;
  }, [currentPage, pageSize, status, searchTerm]);

  // 데이터 불러오기 함수
  const fetchDogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = getQueryParams();
      console.log('[API 요청] 파라미터:', params);
      console.log('[API 요청] 현재 페이지:', currentPage);

      const response = await getDogList(shelterId, params);
      console.log('[API 응답] 전체:', response);

      // API 응답이 배열인 경우
      if (Array.isArray(response)) {
        console.log('[API 응답] 배열 형태의 응답, 길이:', response.length);
        setDogs(response);
        setTotalPages(Math.ceil(response.length / pageSize));
        setTotalElements(response.length);
      }
      // API 응답이 { data: [...] } 형태인 경우
      else if (response && Array.isArray(response.data)) {
        console.log('[API 응답] data 속성 배열, 길이:', response.data.length);
        setDogs(response.data);

        // 페이지네이션 정보 설정
        if (typeof response.totalPages === 'number') {
          setTotalPages(response.totalPages);
        } else if (typeof response.total === 'number') {
          setTotalPages(Math.ceil(response.total / pageSize));
        } else {
          setTotalPages(Math.ceil(response.data.length / pageSize));
        }

        // 총 항목 수 설정
        if (typeof response.total === 'number') {
          setTotalElements(response.total);
        } else if (typeof response.totalElements === 'number') {
          setTotalElements(response.totalElements);
        } else {
          setTotalElements(response.data.length);
        }
      }
      // API 응답이 { content: [...] } 형태인 경우 (Spring Data)
      else if (response && Array.isArray(response.content)) {
        console.log(
          '[API 응답] content 속성 배열, 길이:',
          response.content.length
        );
        setDogs(response.content);

        if (typeof response.totalPages === 'number') {
          setTotalPages(response.totalPages);
        } else if (typeof response.totalElements === 'number') {
          setTotalPages(Math.ceil(response.totalElements / pageSize));
        } else {
          setTotalPages(Math.ceil(response.content.length / pageSize));
        }

        if (typeof response.totalElements === 'number') {
          setTotalElements(response.totalElements);
        } else {
          setTotalElements(response.content.length);
        }
      }
      // 예상치 못한 응답 구조
      else {
        console.error('[API 응답] 예상치 못한 응답 구조:', response);
        setDogs([]);
        setTotalPages(0);
        setTotalElements(0);
        setError('응답 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('[API 호출 에러]', err);
      setError('데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
      setDogs([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, [shelterId, getQueryParams, pageSize, currentPage]); // currentPage를 직접 의존성에 추가

  // 디버깅: 상태 변경 시 로그
  useEffect(() => {
    console.log('[상태 변경] status:', status);
  }, [status]);

  // 디버깅: 페이지 변경 시 로그
  useEffect(() => {
    console.log('[페이지 변경] currentPage:', currentPage);
  }, [currentPage]);

  // 디버깅: dogs 배열 변경 시 로그
  useEffect(() => {
    console.log('[dogs 변경] 길이:', dogs.length);
  }, [dogs]);

  // 의존성 배열 수정: currentPage, status, searchTerm이 변경될 때마다 데이터 다시 불러오기
  useEffect(() => {
    console.log('[fetchDogs 호출] - 페이지, 상태, 검색어 변경됨');
    fetchDogs();
  }, [currentPage, status, searchTerm, fetchDogs]);

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
