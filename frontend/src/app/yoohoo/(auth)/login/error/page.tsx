'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/buttons/Button/Button';
// import { useProcessUserAccount } from '@/hooks/userAccount/useProcessUserAccount';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';

export default function LoginError() {
  const router = useRouter();
  // const { processAccount, isLoading, error } = useProcessUserAccount();
  const { user, checkAuthStatus, isLoading: isAuthLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsLoading(true);
    setError(null); // 이전 오류 상태 초기화
    try {
      console.log('[LoginError] 현재 사용자 정보:', user);
      if (!user?.kakaoEmail) {
        console.error('[LoginError] 사용자 이메일이 없습니다.');
        throw new Error('사용자 이메일을 찾을 수 없습니다.');
      }

      console.log('[LoginError] 계좌 생성 시작:', {
        email: user.kakaoEmail,
        name: user.nickname || '후원자',
      });

      // Next.js API 라우트로 요청
      const response = await fetch('/api/proxy/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.kakaoEmail,
          name: user.nickname || '후원자',
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const result = await response.json();
      console.log('[LoginError] 계좌 생성 결과:', result);

      // 성공 시 리다이렉트
      alert('계좌 생성 성공 ! 이제 즐겁고 투명하게 YooHoo~🐶');
      router.push('/yoohoo');
    } catch (err) {
      console.error('[LoginError] 계좌 생성 실패:', err);
      alert('계좌 생성 실패 ! 다시 시도해주세요.');
      setError('계좌 생성 실패 ! 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
    <div>
      <div>
        <span>원활한 서비스 이용을 위해서는 먼저</span>
        <h3>
          'SSAFY BANK'를 통해 통장을 개설하고, 계좌 등록이 이루어져야 해요.
        </h3>
        <p>
          아래 버튼을 누르시면, 통장 개설부터 계좌 등록까지 한번에 완료할 수
          있어요.
        </p>
        <Button
          variant='primary'
          onClick={handleClick}
          disabled={isLoading || isAuthLoading || !user}
        >
          {isLoading ? '처리 중...' : '통장 개설 & 등록'}
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!user && !isAuthLoading && (
          <p style={{ color: 'red' }}>
            사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.
          </p>
        )}
        <p>
          ※ 이 로직은 SSAFY 교육용 금융망 API에 구조에 맞춰 별도로 추가된 로직
          입니다. 원활한 시연을 위해 소중한 클릭 한번 부탁드려요☺️
        </p>
      </div>
    </div>
  );
}
