// lib/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
  try {
    const response = await fetchWithAxios('/api/auth/user-info');
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return null;
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    await fetchWithAxios('/api/auth/kakao-logout', {
      method: 'POST',
    });
    return true;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return false;
  }
}
