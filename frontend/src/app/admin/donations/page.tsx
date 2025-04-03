'use client';

import styles from './page.module.scss';
import DonationTracker from '@/components/admin/DonationTracker/DonationTracker';
import FinanceTable from '@/components/admin/FinanceTable/FinanceTable';
import IconBox from '@/components/common/IconBox/IconBox';
import { useShelterFinance } from '@/hooks/useShelterFinance';
// import {
//   adaptDonationsToDepositTable,
//   adaptWithdrawalsToWithdrawTable,
// } from '@/lib/util/financeAdapter';

import type { WithdrawTableRowProps } from '@/components/admin/FinanceTable/WithdrawTableRow';
import { DepositTableRowProps } from '@/components/admin/FinanceTable/DepositTableRow';

interface StatItem {
  month: string;
  value: number;
}

export default function DonationsPage() {
  // 5번 보호소 기준으로 데이터 로드 (필요시 동적으로 변경할 수 있습니다)
  const shelterId = 5;

  // useShelterFinance 훅 사용
  const {
    totalDonation,
    totalWithdrawal,
    weeklyDonationData,
    weeklyWithdrawalData,
    // donationItems,
    // withdrawalItems,
    isLoading,
    error,
    refetch,
  } = useShelterFinance(shelterId);

  // 더미 데이터: 입금 내역 (DepositTableRowProps 형식)
  const dummyDepositData: DepositTableRowProps[] = [
    {
      variant: 'row',
      type: '정기후원',
      name: '김철수',
      amount: 50000,
      message: '아이들을 위해 써주세요',
      date: '2025-04-03',
    },
    {
      variant: 'row',
      type: '일시후원',
      name: '이영희',
      amount: 100000,
      message: '따뜻한 겨울 보내세요',
      date: '2025-04-02',
    },
    {
      variant: 'row',
      type: '정기후원',
      name: '박지민',
      amount: 30000,
      message: '매달 작지만 도움이 되길 바랍니다',
      date: '2025-03-30',
    },
    {
      variant: 'row',
      type: '일시후원',
      name: '정민수',
      amount: 200000,
      message: '특별한 날 기부합니다',
      date: '2025-03-28',
    },
    {
      variant: 'row',
      type: '정기후원',
      name: '홍길동',
      amount: 75000,
      date: '2025-03-25',
    },
  ];

  // 더미 데이터: 출금 내역 (WithdrawTableRowProps 형식)
  const dummyWithdrawData: WithdrawTableRowProps[] = [
    {
      withdrawId: 1,
      variant: 'row',
      type: '운영비',
      category: '사료/간식',
      content: '강아지 사료 구매',
      amount: 180000,
      date: '2025-04-01',
      isEvidence: true,
      evidence: 'evidence_file_1.jpg',
      isReceipt: true,
      receipt: 'receipt_file_1.pdf',
    },
    {
      withdrawId: 2,
      variant: 'row',
      type: '의료비',
      category: '예방접종',
      content: '구조견 예방접종 비용',
      amount: 120000,
      date: '2025-03-29',
      isEvidence: true,
      evidence: 'evidence_file_2.jpg',
      isReceipt: true,
      receipt: '/images/dummy.jpeg',
    },
    {
      withdrawId: 3,
      variant: 'row',
      type: '시설비',
      category: '유지보수',
      content: '견사 수리 및 청소',
      amount: 90000,
      date: '2025-03-26',
      isEvidence: true,
      evidence: 'evidence_file_3.jpg',
      isReceipt: false,
    },
    {
      withdrawId: 4,
      variant: 'row',
      type: '장비비',
      category: '기구/장비',
      content: '운반용 캐리어 구매',
      amount: 60000,
      date: '2025-03-22',
      isEvidence: false,
      isReceipt: true,
      receipt: 'receipt_file_4.pdf',
    },
    {
      withdrawId: 5,
      variant: 'row',
      type: '인건비',
      category: '급여',
      content: '직원 3월 급여',
      amount: 250000,
      date: '2025-03-20',
      isEvidence: false,
      isReceipt: false,
    },
  ];

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
          depositData={dummyDepositData}
          withdrawData={dummyWithdrawData}
          className={styles.financeTable}
        />
      </section>
    </div>
  );
}
