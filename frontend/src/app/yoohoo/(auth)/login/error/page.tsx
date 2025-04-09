'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/common/buttons/Button/Button';
import { useProcessUserAccount } from '@/hooks/userAccount/useProcessUserAccount';

export default function LoginError() {
  const router = useRouter();
  const { processAccount, isLoading, error } = useProcessUserAccount();

  const handleClick = async () => {
    try {
      // 여기서 사용자 정보를 직접 전달
      await processAccount({
        email: 'test@example.com', // 실제 사용자 이메일
        name: 'Test User', // 실제 사용자 이름
      });
      // 성공 시 리다이렉트
      router.push('/');
    } catch (err) {
      console.error('계좌 생성 실패:', err);
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
