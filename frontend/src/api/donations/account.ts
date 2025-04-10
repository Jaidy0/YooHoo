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
  // 더미 데이터 정의
  const dummyAccounts = [
    {
      accountNo: '9990994821193495',
      bankName: '싸피은행',
      accountBalance: '0',
    },
    {
      accountNo: '9995373132603649',
      bankName: '싸피은행',
      accountBalance: '0',
    },
  ];

  // 개발 환경에서는 즉시 더미 데이터 반환
  if (process.env.NODE_ENV === 'development') {
    console.log('개발 환경에서 더미 계좌 데이터 사용');
    return dummyAccounts;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/donations/accounts`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('계좌 정보 조회 실패:', error);
    // 어떤 에러가 발생하더라도 항상 더미 데이터 반환
    return dummyAccounts;
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
      bankName: '싸피은행', // 은행 정보가 응답에 없으므로 기본값 사용
    };
  } catch (error) {
    console.error(`단체 ID ${shelterId}의 계좌 정보 조회 실패:`, error);
    return null;
  }
};

/**
 * 후원 전송 API
 * @param donationData 후원 데이터
 * @returns 후원 결과
 */
export const transferDonation = async (donationData: {
  depositAccountNo: string; // 입금 계좌번호 (단체)
  transactionBalance: string; // 거래 금액
  withdrawalAccountNo: string; // 출금 계좌번호 (사용자)
  cheeringMessage: string; // 응원 메시지
  depositorName: string; // 입금자 이름
  donationType: number; // 후원 유형 (0: 정기, 1: 일시)
  dogId?: number; // 강아지 ID (강아지 후원 시)
  shelterId: number; // 단체 ID
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/donations/transfer`,
      donationData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('후원 처리 실패:', error);
    throw error;
  }
};
