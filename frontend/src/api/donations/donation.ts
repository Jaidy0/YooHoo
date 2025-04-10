// src/api/donations/donation.ts
import axios from 'axios';
import {
  DonationItem,
  WithdrawalItem,
  TotalAmountResponse,
  TotalAmountRequest,
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
    const request: TotalAmountRequest = { shelterId };
    const response = await axios.post<TotalAmountResponse>(
      `${API_BASE_URL}/api/donations/shelter/total-amount`,
      request
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
    const request: TotalAmountRequest = { shelterId };
    const response = await axios.post<TotalAmountResponse>(
      `${API_BASE_URL}/api/withdrawal/shelter/total-amount`,
      request
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
export const fetchDonationWeeklySums = async (
  shelterId: number
): Promise<WeeklySumsResponse> => {
  try {
    // Content-Type 헤더를 명시적으로 설정
    const response = await axios.post<WeeklySumsResponse>(
      `${API_BASE_URL}/api/donations/weekly-sums`,
      shelterId.toString(), // 숫자를 문자열로 변환
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
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
export const fetchWithdrawalWeeklySums = async (
  shelterId: number
): Promise<WeeklySumsResponse> => {
  try {
    const request: TotalAmountRequest = { shelterId };
    const response = await axios.post<WeeklySumsResponse>(
      `${API_BASE_URL}/api/withdrawal/weekly-sums`,
      request
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
    const request: TotalAmountRequest = { shelterId };
    const response = await axios.post<DonationItem[]>(
      `${API_BASE_URL}/api/donations/shelter-total`,
      request
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
export const fetchAllWithdrawals = async (
  shelterId: number
): Promise<WithdrawalItem[]> => {
  try {
    const response = await axios.get<WithdrawalItem[]>(
      `${API_BASE_URL}/api/withdrawal/shelter/${shelterId}/all`
    );
    console.log('***>< response.data : ', response.data);
    return response.data;
  } catch (error) {
    console.error('출금 내역 조회 실패:', error);
    throw error;
  }
};
export const initializeAndSaveWithdrawal = async (withdrawalData: {
  shelterId: number;
}): Promise<{
  cardResponse: WithdrawalResponse;
  bankbookResponse: WithdrawalResponse;
}> => {
  try {
    // 1. 보호소 재정 정보 초기화 API 호출 (선행 필수)
    await axios.post(
      `${API_BASE_URL}/api/shelter/${withdrawalData.shelterId}/fininfo`
    );
    console.log('보호소 재정 정보 초기화 성공');

    // 2. 출금 정보 업데이트 API 호출
    const response = await axios.post<WithdrawalResponse>(
      `${API_BASE_URL}/api/withdrawal/sync`,
      withdrawalData
    );
    console.log('출금 정보 업데이트 성공');

    // 백엔드에서 받은 단일 응답을 기존 형태로 변환
    return {
      cardResponse: response.data,
      bankbookResponse: response.data,
    };
  } catch (error) {
    console.error(
      '보호소 재정 정보 초기화 또는 출금 정보 업데이트 실패:',
      error
    );
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

/**
 * 보호소의 카테고리별 지출 비율을 조회하는 API
 * @param shelterId 보호소 ID
 * @returns 카테고리별 평균 및 실제 지출 비율
 */

// 타입 정의 추가
interface CategoryPercentage {
  name: string;
  averagePercentage: number;
  actualPercentage: number;
}

export const fetchWithdrawalCategoryPercentages = async (
  shelterId: number
): Promise<CategoryPercentage[]> => {
  try {
    const response = await axios.post<CategoryPercentage[]>(
      `${API_BASE_URL}/api/withdrawal/category-percentages`,
      { shelterId }
    );
    return response.data;
  } catch (error) {
    console.error('카테고리별 지출 비율 조회 실패:', error);
    throw error;
  }
};

// 타입들을 명시적으로 내보내기
export type {
  DonationItem,
  WithdrawalItem,
  TotalAmountRequest,
  TotalAmountResponse,
  WeeklySumsResponse,
  WithdrawalRequest,
  WithdrawalResponse,
  CategoryPercentage,
};
