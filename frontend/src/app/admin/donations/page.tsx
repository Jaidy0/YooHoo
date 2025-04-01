'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import DonationTracker from '@/components/admin/DonationTracker/DonationTracker';
import FinanceTable from '@/components/admin/FinanceTable/FinanceTable';
import IconBox from '@/components/common/IconBox/IconBox';
import {
  fetchShelterTotalAmount,
  fetchShelterTotalWithdrawal,
  fetchDonationWeeklySums,
  fetchWithdrawalWeeklySums,
} from '@/api/donations/donation';

// 임시 입금 내역 데이터
const mockDepositData = Array(10)
  .fill(null)
  .map((_, index) => ({
    type: index % 2 === 0 ? '단체' : '지정(강아지)',
    name: '서울보호소',
    amount: 99999,
    date: '2025.03.04',
    message: '보호소 후원금',
  }));

// 임시 출금 내역 데이터
const mockWithdrawData = Array(10)
  .fill(null)
  .map((_, index) => ({
    type: index % 2 === 0 ? '단체' : '지정(강아지)',
    category: '의료비',
    content: '중장형 수술',
    amount: 99999,
    date: '2025.03.04',
    isEvidence: true,
    isReceipt: true,
  }));

interface StatItem {
  month: string;
  value: number;
}

export default function DonationsPage() {
  // 상태 관리
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [lastMonthIncome, setLastMonthIncome] = useState<number>(0);
  const [lastMonthExpense, setLastMonthExpense] = useState<number>(0);
  const [donationStats, setDonationStats] = useState<StatItem[]>([]);
  const [withdrawalStats, setWithdrawalStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 1번 보호소 기준으로 데이터 로드 (필요시 동적으로 변경할 수 있습니다)
  const shelterId = 1;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 모든 API 호출을 병렬로 실행
        const [
          donationResponse,
          withdrawalResponse,
          weeklyDonationsResponse,
          weeklyWithdrawalsResponse,
        ] = await Promise.all([
          fetchShelterTotalAmount(shelterId),
          fetchShelterTotalWithdrawal(shelterId),
          fetchDonationWeeklySums(),
          fetchWithdrawalWeeklySums(),
        ]);

        // 총액 데이터 저장
        setTotalAmount(donationResponse.totalAmount);
        setLastMonthIncome(donationResponse.totalAmount); // 당장은 기존처럼 유지
        setLastMonthExpense(withdrawalResponse.totalAmount); // 당장은 기존처럼 유지

        // 주간 기부금액 데이터 변환 (차트용)
        const donationWeeklyStats: StatItem[] = [
          { month: '5주 전', value: weeklyDonationsResponse['5WeeksAgo'] },
          { month: '4주 전', value: weeklyDonationsResponse['4WeeksAgo'] },
          { month: '3주 전', value: weeklyDonationsResponse['3WeeksAgo'] },
          { month: '2주 전', value: weeklyDonationsResponse['2WeeksAgo'] },
          { month: '1주 전', value: weeklyDonationsResponse['1WeeksAgo'] },
          { month: '이번 주', value: weeklyDonationsResponse['ThisWeek'] },
          { month: '예측', value: weeklyDonationsResponse['Prediction'] },
        ];

        // 주간 지출금액 데이터 변환 (차트용)
        const withdrawalWeeklyStats: StatItem[] = [
          { month: '5주 전', value: weeklyWithdrawalsResponse['5WeeksAgo'] },
          { month: '4주 전', value: weeklyWithdrawalsResponse['4WeeksAgo'] },
          { month: '3주 전', value: weeklyWithdrawalsResponse['3WeeksAgo'] },
          { month: '2주 전', value: weeklyWithdrawalsResponse['2WeeksAgo'] },
          { month: '1주 전', value: weeklyWithdrawalsResponse['1WeeksAgo'] },
          { month: '이번 주', value: weeklyWithdrawalsResponse['ThisWeek'] },
          { month: '예측', value: weeklyWithdrawalsResponse['Prediction'] },
        ];

        setDonationStats(donationWeeklyStats);
        setWithdrawalStats(withdrawalWeeklyStats);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('데이터를 불러오는 중 오류가 발생했습니다.')
        );
        console.error('데이터 로드 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shelterId]);

  // 데이터 통합
  const data = {
    totalAmount,
    lastMonthIncome,
    lastMonthExpense,
    donationStats,
    withdrawalStats,
  };

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
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
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
              amount={data.totalAmount}
              compareDeposit={data.lastMonthIncome}
              compareWithdraw={data.lastMonthExpense}
            />
          </div>

          <div className={styles.rightColumn}>
            {/* 오른쪽 상단에 입금 내역 */}
            <DonationTracker variant='deposit' amount={data.lastMonthIncome} />

            {/* 오른쪽 하단에 출금 내역 */}
            <DonationTracker
              variant='withdraw'
              amount={data.lastMonthExpense}
            />
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
              {data.donationStats.map((item, index) => (
                <div key={index} className={styles.barChartItem}>
                  <div className={styles.barValue}>
                    {formatNumber(item.value)}
                  </div>
                  <div
                    className={`${styles.bar} ${index === 6 ? styles.barHighlight : ''}`}
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
              {data.withdrawalStats.map((item, index) => (
                <div key={index} className={styles.barChartItem}>
                  <div className={styles.barValue}>
                    {formatNumber(item.value)}
                  </div>
                  <div
                    className={`${styles.bar} ${index === 6 ? styles.barHighlight : ''}`}
                    style={{
                      height: `${getBarHeight(item.value, maxWithdrawalValue)}px`,
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

        {/* FinanceTable 컴포넌트 사용 */}
        <FinanceTable
          depositData={mockDepositData}
          withdrawData={mockWithdrawData}
          className={styles.financeTable}
        />
      </section>
    </div>
  );
}
