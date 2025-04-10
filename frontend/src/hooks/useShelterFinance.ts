// src/hooks/useShelterFinance.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchShelterTotalAmount,
  fetchShelterTotalWithdrawal,
  fetchDonationWeeklySums,
  fetchWithdrawalWeeklySums,
  fetchShelterDonations,
  fetchAllWithdrawals,
  initializeAndSaveWithdrawal,
  // 타입 import
  type DonationItem,
  type WithdrawalItem,
  // type TotalAmountResponse,
  type WeeklySumsResponse,
  type WithdrawalRequest,
  type WithdrawalResponse,
} from '@/api/donations/donation';

interface UseShelterFinanceResult {
  // 총액 데이터
  totalDonation: number | null;
  totalWithdrawal: number | null;
  balance: number | null;

  // 원본 주간 데이터
  weeklyDonationData: WeeklySumsResponse | null;
  weeklyWithdrawalData: WeeklySumsResponse | null;

  // 입출금 내역 데이터
  donationItems: DonationItem[];
  withdrawalItems: WithdrawalItem[];

  // 상태 관리
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  // 출금 저장 함수
  saveWithdrawal: (withdrawalData?: WithdrawalRequest) => Promise<{
    cardResponse: WithdrawalResponse;
    bankbookResponse: WithdrawalResponse;
  }>;

  // 출금 저장 관련 상태
  isSaving: boolean;
  saveError: Error | null;
}

/**
 * 보호소의 재정 정보를 종합적으로 조회하는 커스텀 훅
 * @param shelterId 보호소 ID
 * @returns 기부/지출 금액, 잔액, 주간 데이터 정보
 */
export function useShelterFinance(shelterId: number): UseShelterFinanceResult {
  // 총액 데이터 상태
  const [totalDonation, setTotalDonation] = useState<number | null>(null);
  const [totalWithdrawal, setTotalWithdrawal] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // 원본 주간 데이터
  const [weeklyDonationData, setWeeklyDonationData] =
    useState<WeeklySumsResponse | null>(null);
  const [weeklyWithdrawalData, setWeeklyWithdrawalData] =
    useState<WeeklySumsResponse | null>(null);

  // 입출금 내역 데이터
  const [donationItems, setDonationItems] = useState<DonationItem[]>([]);
  const [withdrawalItems, setWithdrawalItems] = useState<WithdrawalItem[]>([]);

  // 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 출금 저장 관련 상태
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

  // "YYYYMMDD" 형식의 문자열을 타임스탬프로 변환하는 함수
  const parseYYYYMMDD = (dateStr: string): number => {
    if (!dateStr) return 0;

    // "YYYYMMDD" 형식을 "YYYY-MM-DD" 형식으로 변환하여 Date 객체 생성
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    return new Date(`${year}-${month}-${day}`).getTime();
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
        shelterDonationsResponse,
        allWithdrawalsResponse,
      ] = await Promise.all([
        fetchShelterTotalAmount(shelterId),
        fetchShelterTotalWithdrawal(shelterId),
        fetchDonationWeeklySums(shelterId),
        fetchWithdrawalWeeklySums(shelterId),
        fetchShelterDonations(shelterId),
        fetchAllWithdrawals(shelterId),
      ]);

      // 1. 총액 데이터 처리
      const donationAmount = donationTotalResponse.totalAmount;
      const withdrawalAmount = withdrawalTotalResponse.totalAmount;

      setTotalDonation(donationAmount);
      setTotalWithdrawal(withdrawalAmount);
      setBalance(donationAmount - withdrawalAmount);

      // 2. 원본 주간 데이터 저장
      setWeeklyDonationData(donationWeeklyResponse);
      setWeeklyWithdrawalData(withdrawalWeeklyResponse);

      // 3. 입출금 내역 데이터 저장 (최신순 정렬)
      const sortedDonations = [...shelterDonationsResponse].sort((a, b) => {
        // 날짜가 undefined인 경우 처리
        const dateA = a.donationDate ? new Date(a.donationDate).getTime() : 0;
        const dateB = b.donationDate ? new Date(b.donationDate).getTime() : 0;

        // 날짜가 같으면 donationId 역순으로 정렬 (최신 ID가 위로)
        if (dateA === dateB) {
          // donationId가 없는 경우를 대비해 안전하게 처리
          const idA = a.donationId ?? 0;
          const idB = b.donationId ?? 0;
          return idB - idA;
        }

        // 날짜가 다르면 날짜 역순으로 정렬 (최신 날짜가 위로)
        return dateB - dateA;
      });

      const sortedWithdrawals = [...allWithdrawalsResponse].sort((a, b) => {
        // withdrawalDate 대신 date 속성을 사용
        const dateA = a.date ? parseYYYYMMDD(a.date) : 0;
        const dateB = b.date ? parseYYYYMMDD(b.date) : 0;

        // 날짜가 같으면 withdrawalId 역순으로 정렬 (최신 ID가 위로)
        if (dateA === dateB) {
          // withdrawalId가 없는 경우를 대비해 안전하게 처리
          const idA = a.withdrawalId ?? 0;
          const idB = b.withdrawalId ?? 0;
          return idB - idA;
        }

        // 날짜가 다르면 날짜 역순으로 정렬 (최신 날짜가 위로)
        return dateB - dateA;
      });

      setDonationItems(sortedDonations);
      setWithdrawalItems(sortedWithdrawals);
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

  /**
   * 카드와 통장 출금 정보를 동시에 저장하는 함수
   */
  const saveWithdrawal = useCallback(
    async (withdrawalData?: WithdrawalRequest) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        const request: WithdrawalRequest = withdrawalData ?? { shelterId };
        const result = await initializeAndSaveWithdrawal(request);

        // 저장에 성공하면 데이터를 다시 불러옴
        await fetchData();

        return result;
      } catch (err) {
        const errorInstance =
          err instanceof Error
            ? err
            : new Error('출금 정보를 저장하는 중 오류가 발생했습니다.');

        setSaveError(errorInstance);
        console.error('출금 정보 저장 오류:', err);
        throw errorInstance;
      } finally {
        setIsSaving(false);
      }
    },
    [shelterId, fetchData]
  );

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

    // 원본 주간 데이터
    weeklyDonationData,
    weeklyWithdrawalData,

    // 입출금 내역 데이터
    donationItems,
    withdrawalItems,

    // 상태 관리
    isLoading,
    error,
    refetch,

    // 출금 저장 함수와 관련 상태
    saveWithdrawal,
    isSaving,
    saveError,
  };
}
