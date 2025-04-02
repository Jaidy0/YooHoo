import SectionBox from '@/components/common/SectionBox/SectionBox';
import DonutChart from '@/components/charts/DonutChart/DonutChart';
import BarChart from '@/components/charts/BarChart/BarChart';
import styles from './page.module.scss';

export default function DonationReportPage() {
  // 더미 데이터 (실제 구현 시 API에서 가져올 데이터)
  const reportData = {
    donationType: {
      labels: ['단체 후원', '지정 후원'],
      values: [10, 5],
    },
    monthlyDonation: {
      labels: ['11월', '12월', '1월', '2월', '3월'],
      values: [1, 3, 4, 2, 3],
      totalCount: 13,
      recentMonths: 3,
    },
    shelterDonation: {
      labels: ['댕댕 보호소', '바라봄', '행복 보호소'],
      values: [1, 2, 1],
    },
    username: '닉네임',
  };

  return (
    <div className={styles.reportPageContainer}>
      {/* 첫 번째 섹션 - 후원 유형별 비율 */}
      <SectionBox
        title='마이 후원 레포트'
        subtitle='후원 유형별 비율'
        className={styles.reportSection}
      >
        <DonutChart
          data={reportData.donationType}
          centerText={
            <div>
              <strong>총 후원 횟수</strong> <br />
              {reportData.donationType.values.reduce((a, b) => a + b, 0)}번
            </div>
          }
          description={
            <div>
              {reportData.username}님은 지금까지
              <br />
              단체 후원을 {reportData.donationType.values[0]}번,
              <br />
              지정 후원을 {reportData.donationType.values[1]}번 진행하셨습니다.
            </div>
          }
        />
      </SectionBox>

      {/* 두 번째 섹션 - 월별 후원 횟수 */}
      <SectionBox subtitle='월별 후원 횟수' className={styles.reportSection}>
        <BarChart
          data={reportData.monthlyDonation}
          unit='건'
          highlightIndex={reportData.monthlyDonation.labels.length - 1}
          description={`${reportData.username}님은 최근 5개월 동안 총 ${reportData.monthlyDonation.totalCount}회 후원하셨습니다.`}
        />
      </SectionBox>

      {/* 세 번째 섹션 - 단체별 후원 비율 */}
      <SectionBox subtitle='단체별 후원 비율' className={styles.reportSection}>
        <DonutChart
          data={reportData.shelterDonation}
          centerText={
            <div>
              <strong>총 후원 횟수</strong>
              <br />
              {reportData.shelterDonation.values.reduce((a, b) => a + b, 0)}번
            </div>
          }
          description={
            <div>
              {reportData.username}님이 지금까지
              <br />
              후원한 보호 단체의 비율입니다.
            </div>
          }
        />
      </SectionBox>
    </div>
  );
}
