'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionBox from '@/components/common/SectionBox/SectionBox';
import IconBox from '@/components/common/IconBox/IconBox';
import DonutChart from '@/components/charts/DonutChart/DonutChart';
import styles from './DonationReportSummary.module.scss';
import { useAuthStore } from '@/store/authStore';
import { processDataForReport } from '@/lib/util/donationReportUtils';
import { ReportData } from '@/types/donation';

// 부모 컴포넌트로부터 받을 prop 타입 정의
interface DonationReportSummaryProps {
  donations: any[]; // 타입은 실제 DonationHistory 타입에 맞게 수정
  isLoading: boolean;
  hasError: boolean;
  className?: string;
}

export default function DonationReportSummary({
  donations,
  isLoading,
  hasError,
  className = '',
}: DonationReportSummaryProps) {
  const router = useRouter();
  const { user } = useAuthStore();
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

  // 전달받은 donations 데이터로 레포트 데이터 처리
  useEffect(() => {
    if (!isLoading && !hasError && donations.length > 0) {
      setHasData(true);
      const processedData = processDataForReport(
        donations,
        user?.nickname || '후원자'
      );
      setReportData(processedData);
    } else {
      setHasData(false);
    }
  }, [donations, isLoading, hasError, user]);

  const handleViewAllClick = () => {
    router.push('/yoohoo/profile/donation-report');
  };

  if (isLoading) {
    return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  }

  if (!hasData || hasError) {
    return (
      <SectionBox
        title='마이 후원 레포트'
        subtitle='후원 유형별 비율'
        className={`${styles.reportSection} ${className}`}
      >
        <div className={styles.noDataMessage}>
          <p>후원 내역이 없습니다.</p>
          <p>첫 번째 후원을 통해 의미 있는 변화를 만들어보세요!</p>
        </div>
      </SectionBox>
    );
  }

  return (
    <SectionBox
      title='마이 후원 레포트'
      subtitle='후원 유형별 비율'
      className={`${styles.reportSection} ${className}`}
      titleRight={
        <button className={styles.viewAllButton} onClick={handleViewAllClick}>
          전체보기 <IconBox name='chevron' size={16} />
        </button>
      }
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
  );
}
