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
