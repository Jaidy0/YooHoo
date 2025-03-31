import axios from 'axios';
import { ShelterDetail } from '@/types/shelter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
