// api/dogApi.ts
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

export const getDogList = async (
  shelterId: number,
  params?: DogQueryParams
): Promise<DogResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    if (params?.status && params.status.length > 0) {
      params.status.forEach((status) => {
        queryParams.append('status', status.toString());
      });
    }

    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }

    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/shelter/${shelterId}/dogs${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get<DogResponse>(url, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(`보호소 ID ${shelterId}의 강아지 리스트 조회 실패:`, error);
    throw error;
  }
};

// 기타 API 함수들 (getDogDetail, saveDog, uploadDogImage)...
