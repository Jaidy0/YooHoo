import { useState, useEffect, useCallback } from 'react';
import { fetchDonations, getUserDonations } from '@/api/donations/myDonation';

// 후원 내역 타입 정의
export interface DonationHistory {
  donationId: number;
  donationAmount: number;
  transactionUniqueNo: string;
  donationDate: string;
  depositorName: string;
  cheeringMessage?: string;
  userNickname: string | null;
  dogName?: string;
  shelterName: string;
}

// 날짜를 'YYYY-MM-DD' 형식으로 변환하는 유틸리티 함수
const formatDateToISO = (date: Date | null): string | null => {
  if (!date) return null;

  // 현지 시간의 연, 월, 일을 추출
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const useDonationsByDateRange = () => {
  const [donations, setDonations] = useState<DonationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 공통 정렬 함수
  const sortByDateDesc = (data: DonationHistory[]) => {
    return data.sort(
      (a, b) =>
        new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
    );
  };

  const getDonationsByDateRange = useCallback(
    async (startDate: Date | null, endDate: Date | null) => {
      setIsLoading(true);
      setError(null);

      try {
        // 날짜 설정이 없으면 전체 후원 내역 조회
        if (!startDate && !endDate) {
          const response = await getUserDonations();
          const sorted = sortByDateDesc(response);
          setDonations(response);
          return response;
        }

        // 날짜 범위 설정 - 두 날짜가 모두 있는 경우에만 필터링
        if (startDate && endDate) {
          const params = {
            startDate: formatDateToISO(startDate)!,
            endDate: formatDateToISO(endDate)!,
          };

          const response = await fetchDonations(params);
          const sorted = sortByDateDesc(response);
          setDonations(sorted);
          return sorted;
        }

        // 한쪽 날짜만 있는 경우
        console.warn('날짜 범위가 완전하지 않습니다.');
        setDonations([]);
        return [];
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '후원 내역을 불러오는 중 오류가 발생했습니다.';

        setError(errorMessage);
        console.error(err);
        setDonations([]);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 컴포넌트 마운트 시 전체 후원 내역 기본 조회
  useEffect(() => {
    getDonationsByDateRange(null, null);
  }, [getDonationsByDateRange]);

  return {
    donations,
    getDonationsByDateRange,
    isLoading,
    error,
  };
};

// 사용자 전체 후원 내역 훅
export const useDonations = () => {
  const [donations, setDonations] = useState<DonationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDonations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getUserDonations();
        setDonations(response);
      } catch (err) {
        setError('후원 내역을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
        setDonations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDonations();
  }, []);

  return {
    donations,
    isLoading,
    error,
  };
};
