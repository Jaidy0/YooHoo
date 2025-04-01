import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.scss';
import MySummaryCard from '@/components/profile/MySummaryCard/MySummaryCard';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import IconBox from '@/components/common/IconBox/IconBox';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const router = useRouter();

  // 더미 데이터
  const [userInfo, setUserInfo] = useState({
    nickname: '닉네임',
    createdAt: 24,
  });

  const [donationStats, setDonationStats] = useState({
    donationCount: 15,
    totalAmount: 10000,
    organizationCount: 2,
    dogCount: 3,
  });

  const handleMoveToReportPage = () => {
    router.push('/yoohoo/profile/donation-report');
  };

  return (
    <div className={`${styles.dashboard} ${className}`}>
      {/* 사용자 정보 헤더 */}
      <div className={styles.userHeader}>
        <h2 className={styles.userText}>
          {userInfo.nickname}님, <br />
          <span className={styles.accentText}>유후</span>와 함께한지
          <span className={styles.accentText}>{userInfo.createdAt}일</span>째예요!
        </h2>
        <div className={styles.userSettingsButton}>
          <IconBox name='gear' size={20} />
        </div>
      </div>

      {/* 마이 후원 레포트 */}
      <div className={styles.buttonContainer}>
        <MoveButton
          leftIcon={<IconBox name='cart' size={20} />}
          rightIcon={<IconBox name='chevron' size={20} />}
          className={styles.moveButton}
          variant='secondary'
        >
          마이 후원 레포트
        </MoveButton>
      </div>

      {/* 요약 카드 그리드 */}
      <div className={styles.summaryGrid}>
        <MySummaryCard
          title='후원한 횟수'
          value={donationStats.donationCount}
        />
        <MySummaryCard title='후원한 금액' value={donationStats.totalAmount} />
        <MySummaryCard
          title='후원 단체 수'
          value={donationStats.organizationCount}
        />
        <MySummaryCard title='후원 강아지 수' value={donationStats.dogCount} />
      </div>
    </div>
  );
}
