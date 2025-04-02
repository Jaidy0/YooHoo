import { useState, useEffect } from 'react';
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

  // 더미 데이터 (user 정보가 없을 경우 대비)
  const [donationStats] = useState({
    donationCount: 15,
    totalAmount: 10000,
    organizationCount: 2,
    dogCount: 3,
  });

  // 가입일로부터 현재까지의 일수 계산
  const calculateDaysSinceJoin = () => {
    if (!user?.created_at) return 1; // 정보가 없으면 기본값 1일

    // 가입일 날짜만 추출 (시간 제외)
    const createDate = new Date(user.created_at.split('T')[0]);

    // 오늘 날짜 (시간 제외)
    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // 날짜 차이 계산 (밀리초 단위)
    const timeDiff = todayWithoutTime.getTime() - createDate.getTime();

    // 일수로 변환
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // 당일은 1일, 하루 전은 2일로 계산
    return daysDiff + 1;
  };

  const daysSinceJoin = calculateDaysSinceJoin();

  const handleMoveToReportPage = () => {
    router.push('/yoohoo/profile/donation-report');
  };

  const handleSaveNickname = (newNickname: string) => {
    // 닉네임 변경 로직은 별도 API 필요
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
          {user?.nickname || '사용자'}님, <br />
          <span className={styles.accentText}>유후</span>와 함께한지{' '}
          <span className={styles.accentText}>{daysSinceJoin}일</span>
          째예요!
        </h2>
        <div className={styles.userBtns}>
          <div
            className={styles.userSettingsButton}
            onClick={() => setIsModalOpen(true)}
          >
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
          initialValue={user?.nickname || ''}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNickname}
        />
      )}
    </div>
  );
}
