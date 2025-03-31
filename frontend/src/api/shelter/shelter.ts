import axios from 'axios';
import { ShelterDetail } from '@/types/shelter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 보호소 상세 정보를 가져오는 API
 * @param shelterId 보호소 ID
 * @returns 보호소 상세 정보
 */
export const getShelterDetail = async (
  shelterId: number
): Promise<ShelterDetail> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/shelter/${shelterId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`보호소 ID ${shelterId} 정보 조회 실패:`, error);
    throw error;
  }
};

/**
 * 보호소별 강아지 상태 개수를 가져오는 API
 * @param shelterId 보호소 ID
 * @returns 상태별 강아지 수 (입양, 보호, 구조)
 */
export const getDogCountByShelter = async (
  shelterId: number
): Promise<{
  adoption: number;
  protection: number;
  rescue: number;
}> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/dogs/status?shelterId=${shelterId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `보호소 ID ${shelterId}의 강아지 상태 통계 조회 실패:`,
      error
    );
    throw error;
  }
};
