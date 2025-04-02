import axios from 'axios';
import { AccountInfo } from '@/types/account';
import { ShelterAccountInfo } from '@/types/shelter';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

/**
 * 사용자의 계좌 정보를 가져오는 API
 * @returns 사용자의 계좌 정보 배열
 */
export const getUserAccounts = async (): Promise<AccountInfo[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/donations/accounts`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('계좌 정보 조회 실패:', error);
    return [];
  }
};

/**
 * 단체의 계좌 정보를 가져오는 API
 * @param shelterId 단체 ID
 * @returns 단체 계좌 정보
 */
export const getShelterAccountInfo = async (
  shelterId: number
): Promise<ShelterAccountInfo | null> => {
  if (!shelterId) return null;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/shelter/${shelterId}/accountinfo`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`단체 ID ${shelterId}의 계좌 정보 조회 실패:`, error);
    return null;
  }
};
