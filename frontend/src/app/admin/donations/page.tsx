'use client';

import styles from './page.module.scss';
import DonationTracker from '@/components/admin/DonationTracker/DonationTracker';
import FinanceTable from '@/components/admin/FinanceTable/FinanceTable';
import IconBox from '@/components/common/IconBox/IconBox';

// 임시 데이터 (실제로는 API에서 가져올 예정)
const mockDonationData = {
  totalAmount: 12345678,
  lastMonthIncome: 99999,
  lastMonthExpense: 99999,
  monthlyStats: [
    { month: '10월', value: 83 },
    { month: '11월', value: 133 },
    { month: '12월', value: 150 },
    { month: '1월', value: 100 },
    { month: '2월', value: 111 },
    { month: '3월', value: 77 },
    { month: '단체별 평균', value: 133 },
  ],
};

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

export default function DonationsPage() {
  // API 호출 예시 (실제 구현 시 사용)
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['donations'],
  //   queryFn: () => fetch('/api/donations').then(res => res.json())
  // });

  // 임시 데이터 사용
  const data = mockDonationData;

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
            <DonationTracker variant='deposit' amount={data.totalAmount} />

            {/* 오른쪽 하단에 출금 내역 */}
            <DonationTracker variant='withdraw' amount={data.totalAmount} />
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>월별 후원금 통계</h2>
          <div className={styles.iconButton}>
            <IconBox name='zoom' />
          </div>
        </div>
        <div className={styles.chartsContainer}>
          {/* 지출 차트 */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>지출</div>
            <div className={styles.barChart}>
              {data.monthlyStats.map((item, index) => (
                <div key={index} className={styles.barChartItem}>
                  <div className={styles.barValue}>{item.value}</div>
                  <div
                    className={`${styles.bar} ${index === 5 || index === 6 ? styles.barHighlight : ''}`}
                    style={{ height: `${item.value}px` }}
                  ></div>
                  <div className={styles.barLabel}>{item.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 수입 차트 */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>수입</div>
            <div className={styles.barChart}>
              {data.monthlyStats.map((item, index) => (
                <div key={index} className={styles.barChartItem}>
                  <div className={styles.barValue}>{item.value}</div>
                  <div
                    className={`${styles.bar} ${index === 5 || index === 6 ? styles.barHighlight : ''}`}
                    style={{ height: `${item.value}px` }}
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
