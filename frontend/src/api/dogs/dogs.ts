// api/dogs/dogs.ts
import axios from 'axios';
import { DogResponse } from '@/types/dog';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

// 쿼리 파라미터 인터페이스
export interface DogQueryParams {
  search?: string;
  status?: number[];
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 보호소별 강아지 목록 조회 API
 */
export const getDogList = async (
  shelterId: number,
  params: DogQueryParams = {}
): Promise<DogResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append('search', params.search);
    }

    // 상태 필터링 파라미터
    if (
      params.status &&
      Array.isArray(params.status) &&
      params.status.length > 0
    ) {
      params.status.forEach((status) => {
        queryParams.append('status', status.toString());
      });
    }

    // 정렬 파라미터
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/shelter/${shelterId}/dogs${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await axios.get(url, {
      withCredentials: true,
    });

    // 응답이 항상 배열인 경우, DogResponse 인터페이스에 맞게 변환
    const wrappedResponse: DogResponse = {
      data: response.data, // DogResponse 인터페이스의 요구사항에 맞게 'data' 속성 사용
      total: response.data.length,
      totalPages: Math.ceil(response.data.length / (params.size || 20)),
    };

    return wrappedResponse;
  } catch (error) {
    console.error(`보호소 ID ${shelterId}의 강아지 리스트 조회 실패:`, error);
    throw error;
  }
};

/**
 * 강아지 정보 조회 API
 */
export const getDogById = async (dogId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dogs/${dogId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`강아지 ID ${dogId} 조회 실패:`, error);
    throw error;
  }
};

// 기타 강아지 관련 API 함수들...
