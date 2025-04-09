'use client';

import styles from './page.module.scss';
import DonationTracker from '@/components/admin/DonationTracker/DonationTracker';
import FinanceTable from '@/components/admin/FinanceTable/FinanceTable';
import IconBox from '@/components/common/IconBox/IconBox';
import DonationChart from '@/components/admin/DonationChart/DonationChart';
import { useShelterFinance } from '@/hooks/useShelterFinance';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  adaptDonationsToDepositTable,
  adaptWithdrawalsToWithdrawTable,
} from '@/lib/util/financeAdapter';

interface StatItem {
  month: string;
  value: number;
}

export default function DonationsPage() {
  // useAuthStore에서 사용자 정보 가져오기
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  // 유저 정보에서 shelterId 가져오기
  const shelterId = user?.shelterId;

  // 사용자 인증 상태에 따라 데이터 로드 여부 결정
  const [, setShouldLoadData] = useState(false);

  useEffect(() => {
    // 사용자가 인증되고 shelterId가 존재할 때만 데이터 로드
    if (isAuthenticated && shelterId) {
      setShouldLoadData(true);
    }
  }, [isAuthenticated, shelterId]);

  const {
    totalDonation,
    totalWithdrawal,
    weeklyDonationData,
    weeklyWithdrawalData,
    donationItems,
    withdrawalItems,
    isLoading: financeLoading,
    error,
    refetch,
  } = useShelterFinance(shelterId || 5);

  // 로딩 상태 처리 (인증 로딩 또는 재무 데이터 로딩)
  const isLoading = authLoading || financeLoading;

  // 인증 실패 또는 shelterId가 없는 경우 처리
  if (!authLoading && (!isAuthenticated || !shelterId)) {
    return (
      <div className={styles.donationsPage}>
        <div className={styles.errorState}>
          <p>보호소 정보가 없거나 접근 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  const compareWitrawLastWeek =
    (weeklyWithdrawalData?.['ThisWeek'] || 0) -
    (weeklyWithdrawalData?.['1WeeksAgo'] || 0);
  const compareDonationLastWeek =
    (weeklyDonationData?.['ThisWeek'] || 0) -
    (weeklyDonationData?.['1WeeksAgo'] || 0);

  // API 응답에서 주간 통계 데이터 구성
  const donationStats: StatItem[] = [
    { month: '5주 전', value: weeklyDonationData?.['5WeeksAgo'] || 0 },
    { month: '4주 전', value: weeklyDonationData?.['4WeeksAgo'] || 0 },
    { month: '3주 전', value: weeklyDonationData?.['3WeeksAgo'] || 0 },
    { month: '2주 전', value: weeklyDonationData?.['2WeeksAgo'] || 0 },
    { month: '1주 전', value: weeklyDonationData?.['1WeeksAgo'] || 0 },
    { month: '이번 주', value: weeklyDonationData?.['ThisWeek'] || 0 },
    { month: '예측', value: weeklyDonationData?.['Prediction'] || 0 },
  ];

  const withdrawalStats: StatItem[] = [
    { month: '5주 전', value: weeklyWithdrawalData?.['5WeeksAgo'] || 0 },
    { month: '4주 전', value: weeklyWithdrawalData?.['4WeeksAgo'] || 0 },
    { month: '3주 전', value: weeklyWithdrawalData?.['3WeeksAgo'] || 0 },
    { month: '2주 전', value: weeklyWithdrawalData?.['2WeeksAgo'] || 0 },
    { month: '1주 전', value: weeklyWithdrawalData?.['1WeeksAgo'] || 0 },
    { month: '이번 주', value: weeklyWithdrawalData?.['ThisWeek'] || 0 },
    { month: '예측', value: weeklyWithdrawalData?.['Prediction'] || 0 },
  ];

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.donationsPage}>
        <div className={styles.loadingState}>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.donationsPage}>
        <div className={styles.errorState}>
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button className={styles.retryButton} onClick={refetch}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const total = (totalDonation || 0) - (totalWithdrawal || 0);

  return (
    <div className={styles.donationsPage}>
      {/* 후원금 총액 요약 */}
      <section className={styles.adminCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>후원금 흐름 요약</h2>
        </div>

        <div className={styles.summaryCards}>
          <div className={styles.leftColumn}>
            {/* 왼쪽에 총액 표시 */}
            <DonationTracker
              variant='total'
              amount={total || 0}
              compareDeposit={compareWitrawLastWeek || 0}
              compareWithdraw={compareDonationLastWeek || 0}
            />
          </div>

          <div className={styles.rightColumn}>
            {/* 오른쪽 상단에 입금 내역 */}
            <DonationTracker variant='deposit' amount={totalDonation || 0} />

            {/* 오른쪽 하단에 출금 내역 */}
            <DonationTracker variant='withdraw' amount={totalWithdrawal || 0} />
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>주간 후원금 통계</h2>
          <div className={styles.iconButton}>
            <IconBox name='zoom' />
          </div>
        </div>

        {/* 기존 차트를 새로운 DonationChart 컴포넌트로 대체 */}
        <DonationChart
          donationStats={donationStats}
          withdrawalStats={withdrawalStats}
        />
      </section>

      {/* 후원금 입출금 내역 */}
      <section className={styles.adminCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>후원금 입출금 내역</h2>
          <div className={styles.iconButton}>
            <IconBox name='zoom' />
          </div>
        </div>

        {/* FinanceTable 컴포넌트에 실제 API 데이터 전달 */}
        <FinanceTable
          depositData={adaptDonationsToDepositTable(donationItems)}
          withdrawData={adaptWithdrawalsToWithdrawTable(withdrawalItems)}
          className={styles.financeTable}
        />
      </section>
    </div>
  );
}
