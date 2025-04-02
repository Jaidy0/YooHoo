'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import SectionBox from '@/components/common/SectionBox/SectionBox';
import MyHistoryCard from '@/components/common/Card/MyHistoryCard/MyHistoryCard';
import IconBox from '@/components/common/IconBox/IconBox';
import 'react-datepicker/dist/react-datepicker.css';
import DateRangePicker from '@/components/profile/DateRangePicker/DateRangePicker';
import { useAuthGuard } from '@/components/auth/AuthGuard/AuthGuard';

interface DonationHistory {
  id: number;
  type: string; // 일시 후원 or 정기 후원
  organization: string;
  targetName?: string; // 특정 강아지 이름 (있는 경우)
  amount: number;
  date: string;
}

export default function DonationHistoryPage() {
  const isAuthenticated = useAuthGuard();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([
    {
      id: 1,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.03.08',
    },
    {
      id: 2,
      type: '정기 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.03.08',
    },
    {
      id: 3,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.02.08',
    },
    {
      id: 4,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.02.08',
    },
    {
      id: 5,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.01.08',
    },
    {
      id: 6,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.01.08',
    },
  ]);

  if (!isAuthenticated) {
    return null; // 또는 로딩 컴포넌트
  }

  // 날짜 필터링
  const filteredDonations = donationHistory.filter((donation) => {
    const donationDate = new Date(donation.date.replace(/\./g, '-'));
    if (startDate && donationDate < startDate) return false;
    if (endDate && donationDate > endDate) return false;
    return true;
  });

  // 월별로 그룹화
  const groupHistoryByMonth = (data: DonationHistory[]) => {
    const grouped: Record<string, DonationHistory[]> = {};
    data.forEach((donation) => {
      const date = new Date(donation.date.replace(/\./g, '-'));
      const yearMonth = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      if (!grouped[yearMonth]) grouped[yearMonth] = [];
      grouped[yearMonth].push(donation);
    });
    return grouped;
  };

  const groupedEntries = Object.entries(groupHistoryByMonth(filteredDonations));
  const firstMonthGroup = groupedEntries[0];
  const restMonthGroups = groupedEntries.slice(1);

  return (
    <div className={styles.historyContainer}>
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
            <button
              className={styles.resetButton}
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              전체 기간
            </button>
          </div>
        )}

        {firstMonthGroup && firstMonthGroup[1].length > 0 ? (
          <div className={styles.historyList}>
            {firstMonthGroup[1].map((donation) => (
              <MyHistoryCard
                key={donation.id}
                badgeText={donation.type}
                subText={donation.organization}
                mainText={`${donation.amount.toLocaleString()}원`}
                date={donation.date}
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
                key={donation.id}
                badgeText={donation.type}
                subText={donation.organization}
                mainText={`${donation.amount.toLocaleString()}원`}
                date={donation.date}
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
