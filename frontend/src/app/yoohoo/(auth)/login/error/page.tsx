'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/buttons/Button/Button';
// import { useProcessUserAccount } from '@/hooks/userAccount/useProcessUserAccount';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useCreateSsafyFinAccount } from '@/hooks/userAccount/createSsafyFinAccount';
import { KAKAO_AUTH_URL } from '@/lib/constants/auth';
import styles from './page.module.scss';
import Image from 'next/image';

export default function LoginError() {
  const router = useRouter();
  // const { processAccount, isLoading, error } = useProcessUserAccount();
  const {
    user,
    checkAuthStatus,
    isLoading: isAuthLoading,
    logout,
  } = useAuthStore();
  const { createAccount, isLoading, error } = useCreateSsafyFinAccount();

  useEffect(() => {
    console.log('[LoginError] 컴포넌트 마운트, 인증 상태 확인 시작');
    checkAuthStatus()
      .then((result) => {
        console.log('[LoginError] 인증 상태 확인 완료:', result);
      })
      .catch((err) => {
        console.error('[LoginError] 인증 상태 확인 실패:', err);
      });
  }, []);

  const handleClick = async () => {
    if (!user?.kakaoEmail) {
      console.error('[LoginError] 사용자 이메일이 없습니다.');
      alert('사용자 이메일을 찾을 수 없습니다.');
      return;
    }

    try {
      await createAccount(user.kakaoEmail);
      alert('계좌 생성 성공 ! 이제 즐겁고 투명하게 YooHoo~🐶');

      // 로그아웃 & 로그인 후 페이지로 리다이렉트
      await logout();
      window.location.href = KAKAO_AUTH_URL;
      router.push('/yoohoo');
    } catch (err) {
      console.error('[LoginError] 계좌 생성 실패:', err);
      alert('계좌 생성 실패 ! 다시 시도해주세요.');
    }
  };

  if (isAuthLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <LoadingSpinner size='large' />
      </div>
    );
  }

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div className={styles.balloon}>
          <h3 className={styles.subtitle}>
            <em className={styles.highlight}>잠깐 !</em>
            <i className={styles.subdesc}>유후가 처음이신가요?</i>
          </h3>
          <p className={styles.desc}>
            후원을 위해서는 먼저 SSAFY 금융망에 통장이 개설되고, 계좌 등록이
            이루어져야 해요. <br />
            <br />
            아래 버튼을 누르시면, <br />
            후원을 위한 계좌개설과 후원금이 입금됩니다.
          </p>
          <Button
            className={styles.button}
            variant='primary'
            onClick={handleClick}
            disabled={isLoading || isAuthLoading || !user}
          >
            {isLoading ? '처리 중...' : '후원할 준비하기 ❤️'}
          </Button>
          <p className={styles.notice}>
            이 과정은 SSAFY 교육용 금융망 API 구조에 맞춰 별도로 추가된 과정
            입니다. 원활한 시연을 위해 소중한 클릭 한번 부탁드려요.
          </p>
        </div>

        <div className={styles.dogImage}>
          <Image
            src='/images/dog_complete.png'
            alt='dog'
            width={100}
            height={100}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!user && !isAuthLoading && (
          <p style={{ color: 'red' }}>
            사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.
          </p>
        )}
      </div>
    </div>
  );
}
