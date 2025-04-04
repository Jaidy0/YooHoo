import { useState, useEffect } from 'react';
import {
  fetchBankbookWithdrawal,
  WithdrawalResponse,
} from '@/api/donations/evidence';

interface UseBankbookWithdrawalParams {
  transactionUniqueNo: number;
  shelterId: number;
  enabled?: boolean;
}

interface UseBankbookWithdrawalResult {
  data: WithdrawalResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 통장 출금 내역 조회 훅
 * @param params - 요청 파라미터 (거래번호, 보호소ID, 활성화 여부)
 * @returns 로딩 상태, 데이터, 에러, 재조회 함수
 */
export const useBankbookWithdrawal = ({
  transactionUniqueNo,
  shelterId,
  enabled = true,
}: UseBankbookWithdrawalParams): UseBankbookWithdrawalResult => {
  const [data, setData] = useState<WithdrawalResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!enabled || !transactionUniqueNo || !shelterId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchBankbookWithdrawal({
        transactionUniqueNo,
        shelterId,
      });
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('알 수 없는 오류가 발생했습니다.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [transactionUniqueNo, shelterId, enabled]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
};
