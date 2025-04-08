// src/hooks/useShelterTotalAmount.ts
import { useState, useEffect } from 'react';
import {
  fetchShelterTotalAmount,
  fetchShelterTotalWithdrawal,
} from '@/api/donations/donation';

interface UseShelterTotalAmountResult {
  totalIncome: number;
  totalExpense: number;
  isLoading: boolean;
  error: string | null;
}

export const useShelterTotalAmountResult = (
  shelterId: number
): UseShelterTotalAmountResult => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!shelterId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [incomeData, expenseData] = await Promise.all([
          fetchShelterTotalAmount(shelterId),
          fetchShelterTotalWithdrawal(shelterId),
        ]);

        setTotalIncome(incomeData.totalAmount);
        setTotalExpense(expenseData.totalAmount);
      } catch (err) {
        setError('금액 정보를 불러오는데 실패했습니다.');
        console.error('금액 데이터 로딩 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shelterId]);

  return {
    totalIncome,
    totalExpense,
    isLoading,
    error,
  };
};
