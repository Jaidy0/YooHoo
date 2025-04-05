'use client';

import styles from './page.module.scss';
import DonationTracker from '@/components/admin/DonationTracker/DonationTracker';
import FinanceTable from '@/components/admin/FinanceTable/FinanceTable';
import IconBox from '@/components/common/IconBox/IconBox';
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

  // 차트 데이터에서 최대 값을 구하여 차트 높이 비율 계산
  const getMaxValue = (items: StatItem[]) => {
    return Math.max(...items.map((item) => item.value || 0));
  };

  const maxDonationValue = getMaxValue(donationStats);
  const maxWithdrawalValue = getMaxValue(withdrawalStats);

  // 차트 스케일 계산 (최대 높이 200px 기준)
  const getBarHeight = (value: number, maxValue: number) => {
    if (maxValue === 0) return 0;
    return Math.max((value / maxValue) * 200, 5); // 최소 높이 5px
  };

  // 숫자 포맷팅 함수
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  };

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
              amount={totalDonation || 0}
              compareDeposit={totalDonation || 0}
              compareWithdraw={totalWithdrawal || 0}
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
        <div className={styles.chartsContainer}>
          {/* 수입 차트 */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>수입</div>
            <div className={styles.barChart}>
              {donationStats.map((item, index) => (
                <div key={index} className={styles.barChartItem}>
                  <div className={styles.barValue}>
                    {formatNumber(item.value)}
                  </div>
                  <div
                    className={`${styles.bar} ${
                      index === 6 ? styles.barHighlight : ''
                    }`}
                    style={{
                      height: `${getBarHeight(item.value, maxDonationValue)}px`,
                    }}
                  ></div>
                  <div className={styles.barLabel}>{item.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 지출 차트 */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>지출</div>
            <div className={styles.barChart}>
              {withdrawalStats.map((item, index) => (
                <div key={index} className={styles.barChartItem}>
                  <div className={styles.barValue}>
                    {formatNumber(item.value)}
                  </div>
                  <div
                    className={`${styles.bar} ${
                      index === 6 ? styles.barHighlight : ''
                    }`}
                    style={{
                      height: `${getBarHeight(
                        item.value,
                        maxWithdrawalValue
                      )}px`,
                    }}
                  ></div>
                  <div className={styles.barLabel}>{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
