import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.scss';
import MySummaryCard from '@/components/profile/MySummaryCard/MySummaryCard';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import IconBox from '@/components/common/IconBox/IconBox';
import LogoutBtn from '@/components/auth/LogoutBtn';
import { useAuthStore } from '@/store/authStore';
import NicknameModal from '../NicknameModal/NicknameModal';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 더미 데이터
  const [userInfo] = useState({
    nickname: '닉네임',
    createdAt: 24,
  });

  const [donationStats] = useState({
    donationCount: 15,
    totalAmount: 10000,
    organizationCount: 2,
    dogCount: 3,
  });

  const handleMoveToReportPage = () => {
    router.push('/yoohoo/profile/donation-report');
  };

  const handleSaveNickname = (newNickname: string) => {
    setUserInfo((prev) => ({ ...prev, nickname: newNickname }));
    setIsModalOpen(false);
  };

  const handleMoveToShelterManage = () => {
    router.push('/admin');
  };

  return (
    <div className={`${styles.dashboard} ${className}`}>
      {/* 사용자 정보 헤더 */}
      <div className={styles.userHeader}>
        <h2 className={styles.userText}>
          {userInfo.nickname}님, <br />
          <span className={styles.accentText}>유후</span>와 함께한지
          <span className={styles.accentText}>{userInfo.createdAt}일</span>
          째예요!
        </h2>
        <div className={styles.userBtns}>
          <div className={styles.userSettingsButton}>
            <IconBox name='gear' size={20} />
          </div>
          <LogoutBtn />
        </div>
      </div>

      {/* 마이 후원 레포트 */}
      <div className={styles.buttonContainer}>
        <MoveButton
          leftIcon={<IconBox name='cart' size={20} />}
          rightIcon={<IconBox name='chevron' size={20} />}
          className={styles.moveButton}
          variant='secondary'
          onClick={handleMoveToReportPage}
        >
          마이 후원 레포트
        </MoveButton>
        {user?.is_admin && (
          <MoveButton
            leftIcon={<IconBox name='dog' size={20} />}
            className={styles.moveButton}
            variant='yellow'
            onClick={handleMoveToShelterManage}
          >
            단체 관리
          </MoveButton>
        )}
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

      {isModalOpen && (
        <NicknameModal
          initialValue={userInfo.nickname}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNickname}
        />
      )}
    </div>
  );
}
