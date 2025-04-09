'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/buttons/Button/Button';
import { useProcessUserAccount } from '@/hooks/userAccount/useProcessUserAccount';
import { useAuthStore } from '@/store/authStore';

export default function LoginError() {
  const router = useRouter();
  const { processAccount, isLoading, error } = useProcessUserAccount();
  const user = useAuthStore((state) => state.user);

  const handleClick = async () => {
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

      // authStore에서 가져온 kakaoEmail 사용
      const result = await processAccount({
        email: user.kakaoEmail,
        name: user.nickname || '후원자',
      });

      console.log('[LoginError] 계좌 생성 결과:', result);

      // 성공 시 리다이렉트
      alert('계좌 생성 성공 ! 이제 즐겁고 투명하게 YooHoo~🐶');
      router.push('/yoohoo');
    } catch (err) {
      console.error('[LoginError] 계좌 생성 실패:', err);
      alert('계좌 생성 실패 ! 다시 시도해주세요.');
    }
  };

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
        <Button variant='primary' onClick={handleClick} disabled={isLoading}>
          {isLoading ? '처리 중...' : '통장 개설 & 등록'}
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          ※ 이 로직은 SSAFY 교육용 금융망 API에 구조에 맞춰 별도로 추가된 로직
          입니다. 원활한 시연을 위해 소중한 클릭 한번 부탁드려요☺️
        </p>
      </div>
    </div>
  );
}
