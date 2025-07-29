import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const {
    data: withdrawals = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['shelterWithdrawals', shelterId],
    queryFn: async () => {
      if (!shelterId) {
        throw new Error('보호소 ID가 필요합니다.');
      }

      // 1. 먼저 초기화 및 동기화 수행
      await initializeAndSaveWithdrawal({ shelterId });

      // 2. 초기화된 데이터 조회
      const response = await fetchAllWithdrawals(shelterId);

      // 날짜 기준 최신순 정렬 + 날짜가 같으면 ID 역순 정렬
      return response.sort((a, b) => {
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
    },
    enabled: !!shelterId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 데이터 갱신 함수
  const handleRefetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['shelterWithdrawals', shelterId],
    });
  };

  return {
    withdrawals,
    isLoading,
    error: error as Error | null,
    refetch: handleRefetch,
  };
}
