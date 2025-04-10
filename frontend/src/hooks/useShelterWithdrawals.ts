import { useState, useEffect, useCallback } from 'react';
import {
  fetchAllWithdrawals,
  initializeAndSaveWithdrawal,
  type WithdrawalItem,
} from '@/api/donations/donation';

interface UseShelterWithdrawalsResult {
  withdrawals: WithdrawalItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 보호소의 지출 내역을 조회하는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 지출 내역 목록과 상태 정보
 */
export function useShelterWithdrawals(
  shelterId: number
): UseShelterWithdrawalsResult {
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!shelterId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. 먼저 초기화 및 동기화 수행
      await initializeAndSaveWithdrawal({ shelterId });

      // 2. 초기화된 데이터 조회
      const response = await fetchAllWithdrawals(shelterId);

      // 날짜 기준 최신순 정렬 + 날짜가 같으면 ID 역순 정렬
      const sortedWithdrawals = response.sort((a, b) => {
        const dateA = a.withdrawalDate
          ? new Date(a.withdrawalDate).getTime()
          : 0;
        const dateB = b.withdrawalDate
          ? new Date(b.withdrawalDate).getTime()
          : 0;

        // 날짜가 같으면 withdrawalId 역순으로 정렬 (최신 ID가 위로)
        if (dateA === dateB) {
          const idA = a.withdrawalId ?? 0;
          const idB = b.withdrawalId ?? 0;
          return idB - idA;
        }

        return dateB - dateA;
      });

      setWithdrawals(sortedWithdrawals);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('지출 내역을 불러오는 중 오류가 발생했습니다.')
      );
      console.error('지출 내역 로드 오류:', err);
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
    withdrawals,
    isLoading,
    error,
    refetch,
  };
}
