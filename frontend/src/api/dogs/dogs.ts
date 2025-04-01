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
export interface DogRegisterData {
  name: string;
  age: number;
  weight: number;
  gender: number; // 1: 남, 2: 여
  breed: string;
  energetic?: number;
  familiarity: number;
  isVaccination: boolean;
  isNeutered: boolean;
  status: number; // 1: 보호 중, 2: 입양 완료, 3: 사망, 4: 임시 보호 중
  health?: string;
}

/**
 * 강아지 정보 등록 API
 * @param shelterId 보호소 ID
 * @param dogData 강아지 정보
 * @param file 강아지 이미지 파일
 * @returns 등록된 강아지 정보
 */
export const registerDog = async (
  shelterId: number,
  dogData: DogRegisterData,
  file: File | null
) => {
  try {
    const formData = new FormData();

    // JSON 데이터를 문자열로 변환하여 FormData에 추가
    formData.append('dog', JSON.stringify(dogData));

    // 파일이 있으면 추가
    if (file) {
      formData.append('file', file);
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/shelter/${shelterId}/dogs/register`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error('강아지 등록 실패:', error);
    throw error;
  }
};

// 상태 코드를 숫자로 변환하는 유틸리티 함수
export const getStatusCode = (status: string): number => {
  switch (status) {
    case '보호 중':
      return 1;
    case '입양 완료':
      return 2;
    case '사망':
      return 3;
    case '임시 보호 중':
      return 4;
    default:
      return 1;
  }
};

// 성별 코드를 숫자로 변환하는 유틸리티 함수
export const getGenderCode = (gender: string): number => {
  return gender === '남' ? 1 : 2;
};

// Boolean 값으로 변환하는 유틸리티 함수
export const getCompletionStatus = (status: string): boolean => {
  return status === '완료';
};
