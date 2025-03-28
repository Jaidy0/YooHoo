'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
// import MoveButton from '@/components/common/MoveButton';
// import { formatNumber } from '@/lib/formatting';

export default function MyPage() {
  const router = useRouter();
  const [donations, setDonations] = useState([
    {
      id: 1,
      date: '2025-02-08',
      type: '일시 후원',
      organization: '강아지 보호소',
      amount: 10000,
    },
    {
      id: 2,
      date: '2025-02-08',
      type: '정기 후원',
      organization: '행복한 보호소',
      amount: 10000,
    },
    {
      id: 3,
      date: '2025-02-08',
      type: '일시 후원',
      organization: '사랑의 보호소',
      amount: 10000,
    },
  ]);

  const handleMoveToReportPage = () => {
    router.push('/profile/donation-report');
  };

  return (
    <div className={styles.donationListContainer}>

    </div>
  );
}
