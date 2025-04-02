// src/hooks/useShelterFinance.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchShelterTotalAmount,
  fetchShelterTotalWithdrawal,
  fetchDonationWeeklySums,
  fetchWithdrawalWeeklySums,
} from '@/api/donations/donation';

interface WeeklySumsResponse {
  '5WeeksAgo': number;
  '4WeeksAgo': number;
  '3WeeksAgo': number;
  '2WeeksAgo': number;
  '1WeeksAgo': number;
  ThisWeek: number;
  Prediction: number;
}

interface UseShelterFinanceResult {
  // 총액 데이터
  totalDonation: number | null;
  totalWithdrawal: number | null;
  balance: number | null;

  // 원본 주간 데이터
  weeklyDonationData: WeeklySumsResponse | null;
  weeklyWithdrawalData: WeeklySumsResponse | null;

  // 상태 관리
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 보호소의 재정 정보를 종합적으로 조회하는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 기부/지출 금액, 잔액, 주간 데이터 정보
 */
export const useShelterFinance = (
  shelterId: number
): UseShelterFinanceResult => {
  // 총액 데이터 상태
  const [totalDonation, setTotalDonation] = useState<number | null>(null);
  const [totalWithdrawal, setTotalWithdrawal] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // 원본 주간 데이터
  const [weeklyDonationData, setWeeklyDonationData] =
    useState<WeeklySumsResponse | null>(null);
  const [weeklyWithdrawalData, setWeeklyWithdrawalData] =
    useState<WeeklySumsResponse | null>(null);

  // 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 모든 데이터를 조회하는 함수
   */
  const fetchData = useCallback(async () => {
    if (!shelterId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 모든 API 요청을 병렬로 실행
      const [
        donationTotalResponse,
        withdrawalTotalResponse,
        donationWeeklyResponse,
        withdrawalWeeklyResponse,
      ] = await Promise.all([
        fetchShelterTotalAmount(shelterId),
        fetchShelterTotalWithdrawal(shelterId),
        fetchDonationWeeklySums(),
        fetchWithdrawalWeeklySums(),
      ]);

      // 1. 총액 데이터 처리
      const donationAmount = donationTotalResponse.totalAmount;
      const withdrawalAmount = withdrawalTotalResponse.totalAmount;

      setTotalDonation(donationAmount);
      setTotalWithdrawal(withdrawalAmount);
      setBalance(donationAmount - withdrawalAmount);

      // 2. 원본 주간 데이터 저장
      setWeeklyDonationData(donationWeeklyResponse);
      setWeeklyWithdrawalData(withdrawalWeeklyResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
      );
      console.error('재정 데이터 로드 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [shelterId]);

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 데이터 갱신 함수
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    // 총액 데이터
    totalDonation,
    totalWithdrawal,
    balance,

    // 원본 주간 데이터
    weeklyDonationData,
    weeklyWithdrawalData,

    // 상태 관리
    isLoading,
    error,
    refetch,
  };
};
