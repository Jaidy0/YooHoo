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

    // 페이지 파라미터 전달 (중요: API가 0-based 페이지네이션 사용)
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
      console.log('[dogApi] 페이지 파라미터:', params.page);
    }

    // 페이지 크기 파라미터 전달
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
      console.log('[dogApi] 페이지 크기 파라미터:', params.size);
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
      console.log('[dogApi] 상태 파라미터:', params.status);
    }

    // 정렬 파라미터
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/shelter/${shelterId}/dogs${queryString ? `?${queryString}` : ''}`;

    console.log('[dogApi] 요청 URL:', url);

    const response = await axios.get(url, {
      withCredentials: true,
    });

    console.log('[dogApi] 응답 데이터:', response.data);

    // 응답 데이터에 페이지 정보가 없는 경우 추가해줌
    if (response.data) {
      // 응답이 배열인 경우
      if (Array.isArray(response.data)) {
        // 임시 래핑하여 페이지 정보 추가
        const wrappedResponse = {
          data: response.data,
          page: params.page || 0,
          size: params.size || 20,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / (params.size || 20)),
        };
        return wrappedResponse;
      }
      // 이미 객체이지만 페이지 정보가 없는 경우
      else if (typeof response.data === 'object' && !response.data.page) {
        response.data.page = params.page || 0;
        response.data.size = params.size || 20;

        // data 속성이 있고 배열인 경우
        if (Array.isArray(response.data.data) && !response.data.total) {
          response.data.total = response.data.data.length;
          response.data.totalPages = Math.ceil(
            response.data.data.length / (params.size || 20)
          );
        }
      }
    }

    return response.data;
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
