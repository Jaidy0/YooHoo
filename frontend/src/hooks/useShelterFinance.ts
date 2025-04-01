// src/hooks/useShelterFinance.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchShelterTotalAmount,
  fetchShelterTotalWithdrawal,
} from '@/api/donations/donation';

interface UseShelterFinanceResult {
  totalDonation: number | null;
  totalWithdrawal: number | null;
  balance: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 보호소의 총 기부금액과 총 지출금액을 조회하는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 기부/지출 금액 및 잔액 정보
 */
export const useShelterFinance = (
  shelterId: number
): UseShelterFinanceResult => {
  const [totalDonation, setTotalDonation] = useState<number | null>(null);
  const [totalWithdrawal, setTotalWithdrawal] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!shelterId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 두 API 요청을 병렬로 실행
      const [donationResponse, withdrawalResponse] = await Promise.all([
        fetchShelterTotalAmount(shelterId),
        fetchShelterTotalWithdrawal(shelterId),
      ]);

      const donationAmount = donationResponse.totalAmount;
      const withdrawalAmount = withdrawalResponse.totalAmount;

      setTotalDonation(donationAmount);
      setTotalWithdrawal(withdrawalAmount);

      // 잔액 계산 (기부금액 - 지출금액)
      setBalance(donationAmount - withdrawalAmount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
      );
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
    totalDonation,
    totalWithdrawal,
    balance,
    isLoading,
    error,
    refetch,
  };
};
