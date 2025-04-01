// src/hooks/useShelterFinance.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchShelterTotalAmount,
  fetchShelterTotalWithdrawal,
  fetchDonationWeeklySums,
  fetchWithdrawalWeeklySums,
} from '@/api/donations/donation';

interface WeeklyComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

interface UseShelterFinanceResult {
  // 총액 데이터
  totalDonation: number | null;
  totalWithdrawal: number | null;
  balance: number | null;

  // 주간 비교 데이터
  weeklyDonation: WeeklyComparison | null;
  weeklyWithdrawal: WeeklyComparison | null;

  // 예측 데이터
  donationPrediction: number | null;
  withdrawalPrediction: number | null;

  // 상태 관리
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 보호소의 재정 정보를 종합적으로 조회하는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 기부/지출 금액, 잔액, 주간 비교, 예측 데이터 정보
 */
export const useShelterFinance = (
  shelterId: number
): UseShelterFinanceResult => {
  // 총액 데이터 상태
  const [totalDonation, setTotalDonation] = useState<number | null>(null);
  const [totalWithdrawal, setTotalWithdrawal] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // 주간 비교 데이터 상태
  const [weeklyDonation, setWeeklyDonation] = useState<WeeklyComparison | null>(
    null
  );
  const [weeklyWithdrawal, setWeeklyWithdrawal] =
    useState<WeeklyComparison | null>(null);

  // 예측 데이터 상태
  const [donationPrediction, setDonationPrediction] = useState<number | null>(
    null
  );
  const [withdrawalPrediction, setWithdrawalPrediction] = useState<
    number | null
  >(null);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 변화율 계산 함수
   * @param current 현재 값
   * @param previous 이전 값
   * @returns 변화량 및 변화율
   */
  const calculateChange = (
    current: number,
    previous: number
  ): { change: number; changePercent: number } => {
    const change = current - previous;
    const changePercent = previous === 0 ? 0 : (change / previous) * 100;

    return { change, changePercent };
  };

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

      // 2. 주간 비교 데이터 처리
      const currentWeekDonation = donationWeeklyResponse.ThisWeek;
      const previousWeekDonation = donationWeeklyResponse['1WeeksAgo'];
      const { change: donationChange, changePercent: donationChangePercent } =
        calculateChange(currentWeekDonation, previousWeekDonation);

      setWeeklyDonation({
        current: currentWeekDonation,
        previous: previousWeekDonation,
        change: donationChange,
        changePercent: donationChangePercent,
      });

      const currentWeekWithdrawal = withdrawalWeeklyResponse.ThisWeek;
      const previousWeekWithdrawal = withdrawalWeeklyResponse['1WeeksAgo'];
      const {
        change: withdrawalChange,
        changePercent: withdrawalChangePercent,
      } = calculateChange(currentWeekWithdrawal, previousWeekWithdrawal);

      setWeeklyWithdrawal({
        current: currentWeekWithdrawal,
        previous: previousWeekWithdrawal,
        change: withdrawalChange,
        changePercent: withdrawalChangePercent,
      });

      // 3. 예측 데이터 처리
      setDonationPrediction(donationWeeklyResponse.Prediction);
      setWithdrawalPrediction(withdrawalWeeklyResponse.Prediction);
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

    // 주간 비교 데이터
    weeklyDonation,
    weeklyWithdrawal,

    // 예측 데이터
    donationPrediction,
    withdrawalPrediction,

    // 상태 관리
    isLoading,
    error,
    refetch,
  };
};
