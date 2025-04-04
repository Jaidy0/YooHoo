import { useState, useEffect, useCallback } from 'react';
import {
  fetchCardWithdrawal,
  CardWithdrawalResponse,
  CardTransaction,
} from '@/api/donations/evidence';

interface UseCardWithdrawalProps {
  shelterId: number;
  transactionUniqueNo?: number;
  enabled?: boolean;
}

interface UseCardWithdrawalResult {
  data: CardWithdrawalResponse | null;
  filteredTransaction: CardTransaction | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCardWithdrawal = ({
  shelterId,
  transactionUniqueNo,
  enabled = true,
}: UseCardWithdrawalProps): UseCardWithdrawalResult => {
  const [data, setData] = useState<CardWithdrawalResponse | null>(null);
  const [filteredTransaction, setFilteredTransaction] =
    useState<CardTransaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchCardWithdrawal({ shelterId });
      setData(response);

      if (transactionUniqueNo && response.REC && response.REC.transactionList) {
        const matchingTransaction = response.REC.transactionList.find(
          (transaction) =>
            String(transaction.transactionUniqueNo) ===
            String(transactionUniqueNo)
        );
        setFilteredTransaction(matchingTransaction || null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('알 수 없는 오류가 발생했습니다.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [shelterId, transactionUniqueNo, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    filteredTransaction,
    isLoading,
    error,
    refetch: fetchData,
  };
};
