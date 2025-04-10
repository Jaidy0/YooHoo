// lib/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import { User } from '@/types/user';
import { Shelter } from '@/types/shelter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 포함 (credentials: 'include'와 동일)
  headers: {
    'Content-Type': 'application/json',
  },
});

async function fetchWithAxios(url: string, options: AxiosRequestConfig = {}) {
  try {
    const response = await axiosInstance({
      url,
      ...options,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API 요청 실패: ${error.response.status}`);
    }
    throw error;
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  // 개발 환경에서는 API 호출 없이 모의 데이터 직접 반환
  if (process.env.NODE_ENV === 'development') {
    console.log('개발 환경: 모의 사용자 데이터 반환 (API 호출 없음)');

    await new Promise((resolve) => setTimeout(resolve, 500));

    // localStorage에서 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      console.log('로그인 상태 아님');
      return null;
    }

    // 로그인 상태일 때만 모의 데이터 반환
    return {
      userId: 1,
      nickname: '테스트 유저',
      kakaoEmail: 'test@example.com',
      isAdmin: true,
      shelterId: 1,
      createdAt: '2024-03-15T10:30:00Z', // ISO 8601 형식의 날짜 추가
    };
  }

  // 프로덕션 환경에서는 실제 API 호출
  try {
    const response = await axiosInstance.get('/api/auth/user-info');
    console.log('fetchCurrentUser response', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return null;
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    if (process.env.NODE_ENV === 'development') {
      // 개발 환경: localStorage에서 로그인 상태 제거
      console.log('개발 환경: 로그아웃 처리');
      localStorage.removeItem('isLoggedIn');
      return true;
    }

    await fetchWithAxios('/api/auth/logout', {
      method: 'POST',
      withCredentials: true,
    });

    return true;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return false;
  }
}

export async function fetchShelters(
  sort: 'dogcount' | 'reliability' = 'reliability'
): Promise<Shelter[]> {
  try {
    const response = await fetchWithAxios(`/api/shelter?sort=${sort}`);
    return response.data;
  } catch (error) {
    console.error('보호소 정보 조회 실패:', error);
    throw error;
  }
}
