import axios from 'axios';
import { Dog, DogResponse, DogUpdateDto } from '@/types/dog';

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
 * 강아지 이름 목록 조회 API
 */
export const getDogNames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dogs/names`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('강아지 이름 목록 조회 실패:', error);
    throw error;
  }
};

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

    console.log('***************wrappedResponse : ', wrappedResponse);
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

/**
 * 강아지 등록 데이터 인터페이스
 */
export interface DogRegisterData {
  name: string;
  age: number;
  weight: number;
  gender: number;
  breed: string;
  energetic: number;
  familiarity: number;
  isVaccination: boolean;
  isNeutered: boolean;
  status: number;
}

/**
 * 강아지 등록 API
 * @param dogData - 등록할 강아지 데이터
 * @param dogImage - 등록할 강아지 이미지 파일
 * @returns - 등록된 강아지 정보
 */
export const registerDog = async (
  dogData: DogRegisterData,
  dogImage?: File | null
): Promise<Dog | null> => {
  try {
    const formData = new FormData();

    // JSON 문자열을 직접 추가 (Blob 없이)
    formData.append('dog', JSON.stringify(dogData));

    // 이미지가 있으면 추가
    if (dogImage) {
      formData.append('file', dogImage);
      console.log('이미지 파일 정보:', {
        name: dogImage?.name,
        type: dogImage?.type,
        size: dogImage?.size,
        lastModified: dogImage?.lastModified,
      });
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/dogs/register`,
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
    if (axios.isAxiosError(error) && error.response) {
      console.error('강아지 등록 실패:', error.response.data);
    } else {
      console.error('강아지 등록 실패:', error);
    }
    throw error;
  }
};

/**
 * 강아지 정보 수정 API
 * @param dogId - 수정할 강아지 ID
 * @param dogData - 수정할 강아지 데이터
 * @returns - 응답 데이터
 */
export const updateDog = async (
  dogId: number,
  dogData: DogUpdateDto,
  dogImage?: File | null
) => {
  try {
    const formData = new FormData();

    // JSON을 문자열로 변환하고 Blob으로 래핑한 후 FormData에 추가
    formData.append(
      'dog',
      new Blob([JSON.stringify(dogData)], { type: 'application/json' })
    );

    // 이미지가 있으면 추가
    if (dogImage) {
      formData.append('file', dogImage);
    }

    const response = await axios.patch(
      `${API_BASE_URL}/api/dogs/${dogId}`,
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
    console.error(`강아지 ID ${dogId} 수정 실패:`, error);
    throw error;
  }
};
