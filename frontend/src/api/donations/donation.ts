// src/api/donation/donation.ts
import axios from 'axios';
import {
  DonationItem,
  WithdrawalItem,
  TotalAmountResponse,
  WeeklySumsResponse,
  WithdrawalRequest,
  WithdrawalResponse,
} from '@/types/adminDonation';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

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
 * 카드와 통장 출금 정보를 동시에 저장하는 함수
 * @param withdrawalData 출금 요청 데이터
 * @returns 카드 및 통장 출금 응답 데이터
 */
export const saveWithdrawalToBoth = async (
  withdrawalData: WithdrawalRequest
): Promise<void> => {
  try {
    // 두 API 요청을 병렬로 실행
    // 응답은 무시하고 요청 성공 여부만 확인
    await Promise.all([
      axios.post<WithdrawalResponse>(
        `${API_BASE_URL}/api/card/saveWithdrawal`,
        withdrawalData
      ),
      axios.post<WithdrawalResponse>(
        `${API_BASE_URL}/api/bankbook/saveWithdrawal`,
        withdrawalData
      ),
    ]);
    console.log('출금 정보 업데이트 성공');
  } catch (error) {
    console.error('출금 정보 업데이트 실패:', error);
    throw error;
  }
};

/**
 * 보호소의 재정 정보를 초기화하는 API (응답은 무시)
 * @param shelterId 보호소 ID
 */
export const initializeShelterFinInfo = async (
  shelterId: number
): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/api/shelter/${shelterId}/fininfo`);
    // 응답은 무시하고 요청 성공 여부만 확인
    console.log('보호소 재정 정보 초기화 요청 성공');
  } catch (error) {
    console.error('보호소 재정 정보 초기화 요청 실패:', error);
    throw error;
  }
};
