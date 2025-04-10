// src/hooks/useDogFinance.ts
import { useState, useEffect, useCallback } from 'react';
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
  refetch: () => Promise<void>;
}

/**
 * 강아지 재정 정보를 조회하는 커스텀 훅
 * @param dogId 강아지 ID
 * @returns 입금/출금 데이터 및 상태
 */
export function useDogFinance(dogId: string): UseDogFinanceResult {
  const [rawDepositData, setRawDepositData] = useState<DonationItem[]>([]);
  const [rawWithdrawData, setRawWithdrawData] = useState<WithdrawalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // "YYYYMMDD" 형식의 문자열을 타임스탬프로 변환하는 함수
  const parseYYYYMMDD = (dateStr: string): number => {
    if (!dateStr) return 0;

    // "YYYYMMDD" 형식을 "YYYY-MM-DD" 형식으로 변환하여 Date 객체 생성
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    return new Date(`${year}-${month}-${day}`).getTime();
  };

  // 데이터 조회 함수
  const fetchData = useCallback(async () => {
    if (!dogId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 병렬로 두 API 호출
      const [depositsResult, withdrawalsResult] = await Promise.all([
        fetchDogDonations(dogId),
        fetchDogWithdrawals(dogId),
      ]);

      console.log('API 응답 - 입금 데이터:', depositsResult);
      console.log('API 응답 - 출금 데이터:', withdrawalsResult);

      // 입금 데이터 최신순 정렬
      const sortedDeposits = [...depositsResult].sort((a, b) => {
        const dateA = a.donationDate ? new Date(a.donationDate).getTime() : 0;
        const dateB = b.donationDate ? new Date(b.donationDate).getTime() : 0;

        // 날짜가 같으면 donationId 역순으로 정렬 (최신 ID가 위로)
        if (dateA === dateB) {
          const idA = a.donationId ?? 0;
          const idB = b.donationId ?? 0;
          return idB - idA;
        }

        return dateB - dateA; // 최신 날짜가 먼저 오도록 정렬
      });

      // 출금 데이터 최신순 정렬
      const sortedWithdrawals = [...withdrawalsResult].sort((a, b) => {
        // withdrawalDate 또는 date 속성 사용
        const dateA = a.withdrawalDate
          ? new Date(a.withdrawalDate).getTime()
          : a.date
            ? parseYYYYMMDD(a.date)
            : 0;
        const dateB = b.withdrawalDate
          ? new Date(b.withdrawalDate).getTime()
          : b.date
            ? parseYYYYMMDD(b.date)
            : 0;

        // 날짜가 같으면 withdrawalId 역순으로 정렬 (최신 ID가 위로)
        if (dateA === dateB) {
          const idA = a.withdrawalId ?? 0;
          const idB = b.withdrawalId ?? 0;
          return idB - idA;
        }

        return dateB - dateA; // 최신 날짜가 먼저 오도록 정렬
      });

      setRawDepositData(sortedDeposits);
      setRawWithdrawData(sortedWithdrawals);
    } catch (err) {
      console.error('후원금 데이터 로딩 실패:', err);
      setError('후원금 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [dogId]);

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    if (dogId) {
      fetchData();
    }
  }, [dogId, fetchData]);

  // 데이터 갱신 함수
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // 입금 데이터 포맷 변환
  const depositData: FormattedDepositItem[] = rawDepositData.map((item) => ({
    type: `지정(${item.dogName})`, // 강아지 페이지이므로 지정 후원
    name: item.depositorName || '-',
    amount: item.donationAmount || 0,
    date: item.donationDate
      ? new Date(item.donationDate).toLocaleDateString('ko-KR')
      : '-',
    message: item.cheeringMessage || '-',
    depositorName: item.depositorName || '-',
    content: item.content || '-',
  }));

  // 출금 데이터 포맷 변환
  const withdrawData: FormattedWithdrawalItem[] = rawWithdrawData.map(
    (item) => {
      // 데이터 디버깅
      console.log('출금 항목 변환 전:', item);

      const formattedItem = {
        withdrawalId: item.withdrawalId || 0,
        type: `지정(${item.name})`,
        category: item.category || '-',
        content: item.content || '-',
        amount: item.amount || Number(item.transactionBalance) || 0,
        date: (item.withdrawalDate
          ? new Date(item.withdrawalDate)
          : item.date
            ? new Date(
                `${item.date.substring(0, 4)}-${item.date.substring(4, 6)}-${item.date.substring(6, 8)}`
              )
            : new Date()
        ).toLocaleDateString('ko-KR'),
        file_id: item.file_id,
        transactionUniqueNo: parseInt(item.transactionUniqueNo || '0', 10),
      };

      // 변환 후 데이터 디버깅
      console.log('출금 항목 변환 후:', formattedItem);

      return formattedItem;
    }
  );

  // 최종 데이터 디버깅
  console.log('최종 가공된 출금 데이터:', withdrawData);

  return {
    depositData,
    withdrawData,
    rawDepositData,
    rawWithdrawData,
    isLoading,
    error,
    refetch,
  };
}
