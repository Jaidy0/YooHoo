// src/api/donation/donation.ts
import axios from 'axios';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

interface TotalAmountRequest {
  shelterId: number;
}

interface TotalAmountResponse {
  totalAmount: number;
}

interface WeeklySumsResponse {
  '5WeeksAgo': number;
  '4WeeksAgo': number;
  '3WeeksAgo': number;
  '2WeeksAgo': number;
  '1WeeksAgo': number;
  ThisWeek: number;
  Prediction: number;
}

/**
 * 특정 보호소의 총 기부금액을 조회하는 API
 * @param shelterId 보호소 ID
 * @returns 총 기부금액 정보
 */
export const fetchShelterTotalAmount = async (
  shelterId: number
): Promise<TotalAmountResponse> => {
  try {
    const response = await axios.post<TotalAmountResponse>(
      `${API_BASE_URL}/api/donations/shelter/total-amount`,
      { shelterId }
    );
    return response.data;
  } catch (error) {
    console.error('보호소 총 기부금액 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 보호소의 총 지출금액을 조회하는 API
 * @param shelterId 보호소 ID
 * @returns 총 지출금액 정보
 */
export const fetchShelterTotalWithdrawal = async (
  shelterId: number
): Promise<TotalAmountResponse> => {
  try {
    const response = await axios.post<TotalAmountResponse>(
      `${API_BASE_URL}/api/withdrawal/shelter/total-amount`,
      { shelterId }
    );
    return response.data;
  } catch (error) {
    console.error('보호소 총 지출금액 조회 실패:', error);
    throw error;
  }
};

/**
 * 최근 6주간 기부금액 내역과 예측치를 조회하는 API
 * @returns 주간 기부금액 내역과 예측치
 */
export const fetchDonationWeeklySums =
  async (): Promise<WeeklySumsResponse> => {
    try {
      const response = await axios.get<WeeklySumsResponse>(
        `${API_BASE_URL}/api/donations/weekly-sums`
      );
      return response.data;
    } catch (error) {
      console.error('주간 기부금액 내역 조회 실패:', error);
      throw error;
    }
  };

/**
 * 최근 6주간 지출금액 내역과 예측치를 조회하는 API
 * @returns 주간 지출금액 내역과 예측치
 */
export const fetchWithdrawalWeeklySums =
  async (): Promise<WeeklySumsResponse> => {
    try {
      const response = await axios.get<WeeklySumsResponse>(
        `${API_BASE_URL}/api/withdrawal/weekly-sums`
      );
      return response.data;
    } catch (error) {
      console.error('주간 지출금액 내역 조회 실패:', error);
      throw error;
    }
  };

// src/api/donations/donation.ts에 추가할 코드

// 입금 내역 인터페이스
export interface DonationItem {
  donationId: number;
  donationAmount: number;
  transactionUniqueNo: string;
  donationDate: string;
  depositorName: string;
  cheeringMessage: string | null;
  userNickname: string | null;
  dogName: string | null;
  shelterName: string;
}

// 출금 내역 인터페이스
export interface WithdrawalItem {
  date: string;
  withdrawalId: number;
  transactionUniqueNo: string;
  merchantId: number | null;
  name: string;
  transactionBalance: string;
  shelterId: number;
  category: string;
}

/**
 * 단체 입금 내역 전체 조회 API
 * @param shelterId 보호소 ID
 * @returns 입금 내역 목록
 */
export const fetchShelterDonations = async (
  shelterId: number
): Promise<DonationItem[]> => {
  try {
    const response = await axios.post<DonationItem[]>(
      `${API_BASE_URL}/api/donations/shelter-total`,
      { shelterId }
    );
    return response.data;
  } catch (error) {
    console.error('보호소 입금 내역 조회 실패:', error);
    throw error;
  }
};

/**
 * 후원금 출금 전체 조회 API
 * @returns 출금 내역 목록
 */
export const fetchAllWithdrawals = async (): Promise<WithdrawalItem[]> => {
  try {
    const response = await axios.get<WithdrawalItem[]>(
      `${API_BASE_URL}/api/withdrawal/all`
    );
    return response.data;
  } catch (error) {
    console.error('출금 내역 조회 실패:', error);
    throw error;
  }
};

/**
 * 출금 요청 인터페이스
 */
export interface WithdrawalRequest {
  shelterId: number;
}

/**
 * 출금 응답 인터페이스
 */
export interface WithdrawalResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * 카드와 통장 출금 정보를 동시에 저장하는 함수
 * @param withdrawalData 출금 요청 데이터
 * @returns 카드 및 통장 출금 응답 데이터
 */
export const saveWithdrawalToBoth = async (
  withdrawalData: WithdrawalRequest
): Promise<{
  cardResponse: WithdrawalResponse;
  bankbookResponse: WithdrawalResponse;
}> => {
  try {
    // 두 API 요청을 병렬로 실행
    const [cardResponse, bankbookResponse] = await Promise.all([
      axios.post<WithdrawalResponse>(
        `${API_BASE_URL}/api/card/saveWithdrawal`,
        withdrawalData
      ),
      axios.post<WithdrawalResponse>(
        `${API_BASE_URL}/api/bankbook/saveWithdrawal`,
        withdrawalData
      ),
    ]);

    // 두 응답을 객체로 반환
    return {
      cardResponse: cardResponse.data,
      bankbookResponse: bankbookResponse.data,
    };
  } catch (error) {
    console.error('출금 정보 저장 실패:', error);
    throw error;
  }
};

/**
 * 출금 내역에 강아지 ID 할당 API
 * @param withdrawalId 출금 내역 ID
 * @param newDogId 새로 할당할 강아지 ID
 * @returns 강아지 정보 (이름 등)
 */
export const assignDogToWithdrawal = async (
  withdrawalId: number,
  newDogId: number
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/withdrawal/${withdrawalId}/dogId`,
      { newDogId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`출금 내역 ID ${withdrawalId}에 강아지 할당 실패:`, error);
    throw error;
  }
};
