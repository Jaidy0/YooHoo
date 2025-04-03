import axios from 'axios';
import { Dog } from '@/types/dog';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

// 후원한 강아지 목록 조회
export const getUserDonatedDogs = async (): Promise<Dog[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/donations/dogs`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('후원한 강아지 목록 조회 실패:', error);
    throw error;
  }
};
