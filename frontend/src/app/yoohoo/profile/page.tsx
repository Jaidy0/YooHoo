'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import SectionBox from '@/components/common/SectionBox/SectionBox';
import MyHistoryCard from '@/components/common/Card/MyHistoryCard/MyHistoryCard';
import IconBox from '@/components/common/IconBox/IconBox';
import 'react-datepicker/dist/react-datepicker.css';
import DateRangePicker from '@/components/profile/DateRangePicker/DateRangePicker';
import { useAuthGuard } from '@/components/auth/AuthGuard/AuthGuard';
import { useDonationsByDateRange } from '@/hooks/donations/useDonationHistory';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import DonationReportSummary from '@/components/profile/DonationReportSummary/DonationReportSummary';

interface DonationHistory {
  donationId: number;
  donationDate: string;
  donationAmount: number;
  shelterName: string;
  dogName?: string; // 강아지 후원인 경우에만 존재
}

export default function DonationHistoryPage() {
  const isAuthenticated = useAuthGuard();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const {
    donations: donationHistory,
    getDonationsByDateRange,
    isLoading,
    error,
  } = useDonationsByDateRange();

  // 날짜 변경 시 API 호출
  useEffect(() => {
    if (startDate && endDate) {
      getDonationsByDateRange(startDate, endDate);
    }
  }, [startDate, endDate, getDonationsByDateRange]);

  if (isLoading) {
    return <LoadingSpinner />; // 로딩 상태 표시
  }

  if (!isAuthenticated) {
    return null;
  }

  // 날짜 변경 후 API 호출
  const handleDateReset = async () => {
    setStartDate(null);
    setEndDate(null);
    await getDonationsByDateRange(null, null);
  };

  // 월별로 그룹화
  const groupHistoryByMonth = () => {
    const grouped: Record<string, typeof donationHistory> = {};
    donationHistory.forEach((donation) => {
      const date = new Date(donation.donationDate);
      const yearMonth = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      if (!grouped[yearMonth]) grouped[yearMonth] = [];
      grouped[yearMonth].push(donation);
    });
    return grouped;
  };

  // subText 포맷팅 함수
  const formatSubText = (donation: DonationHistory) => {
    if (donation.dogName) {
      // 강아지 후원인 경우 "보호소명(강아지명)" 형식으로 표시
      return `${donation.shelterName}(${donation.dogName})`;
    } else {
      // 단체 후원인 경우 보호소명만 표시
      return donation.shelterName;
    }
  };

  const groupedEntries = Object.entries(groupHistoryByMonth());
  const firstMonthGroup = groupedEntries[0];
  const restMonthGroups = groupedEntries.slice(1);

  return (
    <div className={styles.historyContainer}>
      {/* 후원 레포트 요약 컴포넌트 추가 */}
      <DonationReportSummary
        donations={donationHistory}
        isLoading={isLoading}
        hasError={!!error}
      />

      <SectionBox
        title='마이 후원 내역'
        subtitle={firstMonthGroup ? firstMonthGroup[0] : undefined}
        className={styles.sectionBox}
        titleRight={
          <button
            className={styles.dateFilterBtn}
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <IconBox name='calendar' size={20} />
            기간 설정
          </button>
        }
      >
        {/* date picker */}
        {showPicker && (
          <div className={styles.datepicker}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <button className={styles.resetButton} onClick={handleDateReset}>
              전체 기간
            </button>
          </div>
        )}

        {isLoading ? (
          <p className={styles.loadingMessage}>로딩 중...</p>
        ) : error ? (
          <p className={styles.emptyMessage}>
            해당 기간 내 후원 내역이 없습니다.
          </p>
        ) : firstMonthGroup && firstMonthGroup[1].length > 0 ? (
          <div className={styles.historyList}>
            {firstMonthGroup[1].map((donation) => (
              <MyHistoryCard
                key={donation.donationId}
                badgeText={donation.dogName ? '강아지 후원' : '단체 후원'}
                subText={formatSubText(donation)}
                mainText={`${donation.donationAmount.toLocaleString()}원`}
                date={donation.donationDate.replace(/-/g, '.')}
                variant='history'
                style={{ width: '100%' }}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>
            해당 기간 내 후원 내역이 없습니다.
          </p>
        )}
      </SectionBox>
      {restMonthGroups.map(([month, donations]) => (
        <SectionBox key={month} subtitle={month} className={styles.sectionBox}>
          <div className={styles.historyList}>
            {donations.map((donation) => (
              <MyHistoryCard
                key={donation.donationId}
                badgeText={donation.dogName ? '강아지 후원' : '단체 후원'}
                subText={formatSubText(donation)}
                mainText={`${donation.donationAmount.toLocaleString()}원`}
                date={donation.donationDate.replace(/-/g, '.')}
                variant='history'
                style={{ width: '100%' }}
              />
            ))}
          </div>
        </SectionBox>
      ))}
    </div>
  );
}
