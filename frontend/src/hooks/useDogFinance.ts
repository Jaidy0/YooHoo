// src/hooks/useDogFinance.ts
import { useState, useEffect } from 'react';
import {
  fetchDogDonations,
  fetchDogWithdrawals,
} from '@/api/donations/dogDonation';
import {
  DonationItem,
  WithdrawalItem,
  FormattedDepositItem,
  FormattedWithdrawalItem,
} from '@/types/adminDonation';

interface UseDogFinanceResult {
  depositData: FormattedDepositItem[];
  withdrawData: FormattedWithdrawalItem[];
  rawDepositData: DonationItem[];
  rawWithdrawData: WithdrawalItem[];
  isLoading: boolean;
  error: string | null;
}

export function useDogFinance(dogId: string): UseDogFinanceResult {
  const [rawDepositData, setRawDepositData] = useState<DonationItem[]>([]);
  const [rawWithdrawData, setRawWithdrawData] = useState<WithdrawalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 병렬로 두 API 호출
        const [depositsResult, withdrawalsResult] = await Promise.all([
          fetchDogDonations(dogId),
          fetchDogWithdrawals(dogId),
        ]);

        setRawDepositData(depositsResult);
        setRawWithdrawData(withdrawalsResult);
      } catch (err) {
        console.error('후원금 데이터 로딩 실패:', err);
        setError('후원금 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (dogId) {
      fetchData();
    }
  }, [dogId]);

  // 입금 데이터 포맷 변환
  const depositData: FormattedDepositItem[] = rawDepositData.map((item) => ({
    type: '지정(강아지)', // 강아지 페이지이므로 지정 후원
    name: item.shelterName,
    amount: item.donationAmount,
    date: new Date(item.donationDate).toLocaleDateString('ko-KR'),
    message: item.cheeringMessage || '-',
  }));

  // 출금 데이터 포맷 변환
  const withdrawData: FormattedWithdrawalItem[] = rawWithdrawData.map(
    (item) => ({
      withdrawalId: item.withdrawalId, // 추가: withdrawalId 포함
      type: item.type === 'DOG' ? '지정(강아지)' : '단체',
      category: item.category,
      content: item.content || '-',
      amount: item.amount || Number(item.transactionBalance) || 0,
      date: new Date(item.withdrawalDate || item.date).toLocaleDateString(
        'ko-KR'
      ),
      isReceipt: item.isReceipt || false,
      transactionUniqueNo: parseInt(item.transactionUniqueNo || '0', 10), // 추가: transactionUniqueNo 포함 (문자열을 숫자로 변환)
    })
  );

  return {
    depositData,
    withdrawData,
    rawDepositData,
    rawWithdrawData,
    isLoading,
    error,
  };
}
