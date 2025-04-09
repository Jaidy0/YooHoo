'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionBox from '@/components/common/SectionBox/SectionBox';
import DonutChart from '@/components/charts/DonutChart/DonutChart';
import BarChart from '@/components/charts/BarChart/BarChart';
import styles from './page.module.scss';
import { getUserDonations } from '@/api/donations/myDonation';
import { useAuthStore } from '@/store/authStore';
import { Donation, ReportData } from '@/types/donation';
import { processDataForReport } from '@/lib/util/donationReportUtils';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import IconBox from '@/components/common/IconBox/IconBox';

export default function DonationReportPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [reportData, setReportData] = useState<ReportData>({
    donationType: {
      labels: ['단체 후원', '지정 후원'],
      values: [0, 0],
    },
    weeklyDonation: {
      labels: [],
      values: [],
      totalCount: 0,
      recentPeriods: 5,
    },
    shelterDonation: {
      labels: [],
      values: [],
    },
    username: user?.nickname || '후원자',
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const donations = await getUserDonations();

        // 데이터가 있는지 확인
        if (donations && donations.length > 0) {
          setHasData(true);
          // 데이터 처리 후 reportData 상태 업데이트
          const processedData = processDataForReport(
            donations,
            user?.nickname || '후원자'
          );
          setReportData(processedData);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error('후원 내역 조회 실패:', error);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  // 목록으로 돌아가기 (후원 내역 페이지로 이동)
  const handleBackToList = () => {
    router.push('/yoohoo/profile');
  };

  if (isLoading) {
    return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  }

  if (!hasData) {
    return (
      <div className={styles.noDataContainer}>
        {/* 목록으로 돌아가기 버튼 */}
        <div className={styles.backButtonContainer}>
          <RoundButton onClick={handleBackToList} className={styles.backButton}>
            <IconBox name='arrow' size={16} />
            프로필로 돌아가기
          </RoundButton>
        </div>
        <div className={styles.noDataMessage}>
          <p>후원 내역이 없습니다.</p>
          <p>첫 번째 후원을 통해 의미 있는 변화를 만들어보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reportPageContainer}>
      {/* 목록으로 돌아가기 버튼 */}
      <div className={styles.backButtonContainer}>
        <RoundButton onClick={handleBackToList} className={styles.backButton}>
          <IconBox name='arrow' size={16} />
          프로필로 돌아가기
        </RoundButton>
      </div>
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

      {/* 두 번째 섹션 - 주별 후원 횟수 */}
      <SectionBox subtitle='주별 후원 횟수' className={styles.reportSection}>
        <BarChart
          data={reportData.weeklyDonation}
          unit='건'
          highlightIndex={reportData.weeklyDonation.labels.length - 1}
          description={`${reportData.username}님은 최근 5주 동안 총 ${reportData.weeklyDonation.totalCount}회 후원하셨습니다.`}
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
