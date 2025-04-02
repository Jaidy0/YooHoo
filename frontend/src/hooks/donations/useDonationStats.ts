import { useState, useEffect } from 'react';
import { getUserDonations } from '@/api/donations/myDonation';

interface Donation {
  donationId: number;
  donationAmount: number;
  transactionUniqueNo: string;
  donationDate: string;
  depositorName: string;
  cheeringMessage: string;
  userNickname: string | null;
  dogName: string | null;
  shelterName: string;
}

interface DonationStats {
  donationCount: number;
  totalAmount: number;
  organizationCount: number;
  dogCount: number;
}

export const useDonationStats = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    donationCount: 0,
    totalAmount: 0,
    organizationCount: 0,
    dogCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const donationsData = await getUserDonations();
        setDonations(donationsData);

        // 통계 계산
        if (donationsData.length > 0) {
          // 후원 횟수
          const donationCount = donationsData.length;

          // 후원 총액
          const totalAmount = donationsData.reduce(
            (sum: number, donation: Donation) => sum + donation.donationAmount,
            0
          );

          // 후원한 단체 수 (중복 제거)
          const uniqueOrganizations = new Set(
            donationsData.map((donation: Donation) => donation.shelterName)
          );

          // 후원한 강아지 수 (중복 제거, null 제외)
          const uniqueDogs = new Set(
            donationsData
              .filter((donation: Donation) => donation.dogName !== null)
              .map((donation: Donation) => donation.dogName)
          );

          setStats({
            donationCount,
            totalAmount,
            organizationCount: uniqueOrganizations.size,
            dogCount: uniqueDogs.size,
          });
        }
      } catch (err) {
        console.error('후원 통계 로딩 에러:', err);
        setError('후원 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return { donations, stats, isLoading, error };
};
