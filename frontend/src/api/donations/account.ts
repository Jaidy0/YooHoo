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
    const response = await axios.post(
      `${API_BASE_URL}/api/donations/accounts`,
      {}, // 빈 객체 전송
      {
        withCredentials: true,
      }
    );
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
    const response = await axios.post(
      `${API_BASE_URL}/api/shelter/${shelterId}/accountinfo`,
      {},
      {
        withCredentials: true,
      }
    );

    // 응답 데이터 형식에 맞게 변환
    const data = response.data;

    // 계좌번호 키 찾기 (shelterAccountNo:{shelterId} 형태)
    const accountNoKey = Object.keys(data).find((key) =>
      key.startsWith(`shelterAccountNo:${shelterId}`)
    );

    if (!accountNoKey) return null;

    // 단체 계좌 정보 구성
    return {
      accountNo: data[accountNoKey],
      bankName: '반디은행', // 은행 정보가 응답에 없으므로 기본값 사용
    };
  } catch (error) {
    console.error(`단체 ID ${shelterId}의 계좌 정보 조회 실패:`, error);
    return null;
  }
};
