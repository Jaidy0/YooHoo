// src/hooks/useShelterTotalAmount.ts
import { useQuery } from '@tanstack/react-query';
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
  const {
    data: totalIncome = 0,
    isLoading: isIncomeLoading,
    error: incomeError,
  } = useQuery({
    queryKey: ['shelterTotalIncome', shelterId],
    queryFn: async () => {
      const data = await fetchShelterTotalAmount(shelterId);
      return data.totalAmount;
    },
    enabled: !!shelterId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const {
    data: totalExpense = 0,
    isLoading: isExpenseLoading,
    error: expenseError,
  } = useQuery({
    queryKey: ['shelterTotalExpense', shelterId],
    queryFn: async () => {
      const data = await fetchShelterTotalWithdrawal(shelterId);
      return data.totalAmount;
    },
    enabled: !!shelterId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    totalIncome,
    totalExpense,
    isLoading: isIncomeLoading || isExpenseLoading,
    error: incomeError?.message || expenseError?.message || null,
  };
};
