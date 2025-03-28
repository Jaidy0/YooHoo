// app/(dashboard)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import SectionBox from '@/components/common/SectionBox/SectionBox';
import MyHistoryCard from '@/components/common/Card/MyHistoryCard/MyHistoryCard';
import IconBox from '@/components/common/IconBox/IconBox';

interface DonationHistory {
  id: number;
  type: string; // 일시 후원 or 정기 후원
  organization: string;
  targetName?: string; // 특정 강아지 이름 (있는 경우)
  amount: number;
  date: string;
}

export default function DonationHistoryPage() {
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([
    {
      id: 1,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.02.08',
    },
    {
      id: 2,
      type: '정기 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.02.08',
    },
    {
      id: 3,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.03.08',
    },
    {
      id: 4,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.03.08',
    },
    {
      id: 5,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.04.08',
    },
    {
      id: 6,
      type: '일시 후원',
      organization: '간장치킨 보호소',
      amount: 10000,
      date: '2025.04.08',
    },
  ]);

  // 월별로 히스토리 그룹화
  const groupHistoryByMonth = () => {
    const grouped: Record<string, DonationHistory[]> = {};

    donationHistory.forEach((donation) => {
      const date = new Date(donation.date.replace(/\./g, '-'));
      const yearMonth = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

      if (!grouped[yearMonth]) {
        grouped[yearMonth] = [];
      }

      grouped[yearMonth].push(donation);
    });

    return grouped;
  };

  const groupedHistory = groupHistoryByMonth();

  return (
    <div className={styles.historyContainer}>
      {Object.entries(groupedHistory).map(([month, donations], index) => (
        <SectionBox
          key={month}
          title={index === 0 ? '마이 후원 내역' : undefined}
          subtitle={month}
          className={styles.sectionBox}
        >
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
