import axios from 'axios';
import { Dog, DogResponse, DogUpdateDto } from '@/types/dog';
import { useAuthStore } from '@/store/authStore';

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
  gender: string;
  breed: string;
  energetic: number;
  familiarity: number;
  isVaccination: boolean;
  isNeutered: boolean;
  status: number;
  health?: string;
  shelterId: string;
}

/**
 * 강아지 등록록 API
 */
export const registerDog = async (
  dogData: DogRegisterData,
  dogImage: File | null
): Promise<Dog | null> => {
  try {
    // 현재 로그인한 유저 정보에서 shelterId 가져오기
    const { user } = useAuthStore.getState(); // getState()를 사용하여 현재 상태 가져오기

    if (!user?.isAdmin || !user?.shelterId) {
      throw new Error('보호소 정보가 없거나 관리자 권한이 없습니다.');
    }

    const formData = new FormData();

    // gender를 숫자로 변환 (M -> 1, F -> 0)과 shelterId 추가
    const apiData = {
      ...dogData,
      gender: dogData.gender === 'M' ? 1 : 0,
      shelterId: user.shelterId, // 여기에 shelterId 추가
    };

    // 'dog'라는 키로 전송
    formData.append(
      'dog',
      new Blob([JSON.stringify(apiData)], { type: 'application/json' })
    );

    if (dogImage) {
      formData.append('file', dogImage);
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

    // 응답이 없는 경우 체크
    if (!response || !response.data) {
      console.warn('서버에서 응답이 없거나 비어있습니다.');
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('강아지 등록 실패:', error);
    throw error;
  }
};

/**
 * 강아지 정보 수정 API (백엔드 준비 시 활성화)
 */
export const updateDog = async (dogId: number, dogData: DogUpdateDto) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/dogs/${dogId}`,
      dogData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`강아지 ID ${dogId} 수정 실패:`, error);
    throw error;
  }
};
