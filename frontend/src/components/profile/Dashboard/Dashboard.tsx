import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Dashboard.module.scss';
import MySummaryCard from '@/components/profile/MySummaryCard/MySummaryCard';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import IconBox from '@/components/common/IconBox/IconBox';
import LogoutBtn from '@/components/auth/LogoutBtn';
import { useAuthStore } from '@/store/authStore';
import NicknameModal from '../NicknameModal/NicknameModal';
import { useDonationStats } from '@/hooks/donations/useDonationStats';
import Button from '@/components/common/buttons/Button/Button';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className = '' }: DashboardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 실제 후원 통계 데이터 가져오기
  const { stats } = useDonationStats();

  // 가입일로부터 현재까지의 일수 계산
  const calculateDaysSinceJoin = () => {
    if (!user?.createdAt) return 1; // 정보가 없으면 기본값 1일

    // 가입일 날짜 파싱 (ISO 형식 지원)
    const createDate = new Date(user.createdAt);

    // createDate가 유효한지 확인
    if (isNaN(createDate.getTime())) {
      return 1; // 유효하지 않은 날짜면 기본값 반환
    }

    // 가입일 날짜만 추출 (시간 제외)
    const createDateOnly = new Date(
      createDate.getFullYear(),
      createDate.getMonth(),
      createDate.getDate()
    );

    // 오늘 날짜 (시간 제외)
    const today = new Date();
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // 날짜 차이 계산 (밀리초 단위)
    const timeDiff = todayOnly.getTime() - createDateOnly.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // 당일은 1일, 하루 전은 2일로 계산
    return Math.max(daysDiff + 1, 1); // 최소 1일로 보장
  };
  const daysSinceJoin = calculateDaysSinceJoin();

  const handleMoveToReportPage = () => {
    router.push('/yoohoo/profile/donation-report');
  };

  const handleMoveToShelterManage = () => {
    router.push('/admin');
  };

  return (
    <div
    className={`${styles.dashboard} ${
      user?.isAdmin ? styles.adminDashboard : styles.userDashboard
    } ${className}`}
  >
      {/* 사용자 정보 헤더 */}
      <div className={styles.userHeader}>
        <h2 className={styles.userText}>
          {user?.nickname || '후원자'}님, <br />
          <span className={styles.accentText}>유후</span>와 함께한지{' '}
          <span className={styles.accentText}>{daysSinceJoin}일</span>
          째예요!
        </h2>
        <div className={styles.userBtns}>
          <Button
            variant='primary'
            size='sm'
            onClick={() => setIsModalOpen(true)}
          >
            닉네임 변경
          </Button>
          <LogoutBtn />
        </div>
      </div>

      {/* 버튼 컨테이너 - 원래 크기로 유지 */}
      <div className={styles.buttonGroup}>
        {user?.isAdmin && (
          <MoveButton
            leftIcon={<IconBox name='dog' size={20} />}
            className={styles.adminButton}
            variant='yellow'
            onClick={handleMoveToShelterManage}
          >
            단체 관리
          </MoveButton>
        )}

        {/* 강아지 이미지를 버튼 옆에 배치 */}
        <div className={styles.dogImageContainer}>
          <Image
            src='/images/bandi-profile.png'
            alt='강아지 이미지'
            width={140}
            height={140}
            className={styles.dogImage}
          />
        </div>
      </div>

      {/* 요약 카드 그리드 */}
      <div className={styles.summaryGrid}>
        <MySummaryCard title='후원한 횟수' value={stats.donationCount} />
        <MySummaryCard title='후원한 금액' value={stats.totalAmount} />
        <MySummaryCard title='후원 단체 수' value={stats.organizationCount} />
        <MySummaryCard title='후원 강아지 수' value={stats.dogCount} />
      </div>

      {/* 닉네임 수정 모달 */}
      {isModalOpen && (
        <NicknameModal
          initialValue={user?.nickname || ''}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
