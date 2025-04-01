import { Metadata } from 'next';
import Image from 'next/image';
import GroupDetailClient from './client';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '단체 상세 | 유기견 후원 플랫폼',
  description: '유기견 보호 단체 상세 정보 페이지입니다.',
};

// Next.js 15.2.2에서는 params가 Promise<{ id: string }> 타입임
export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // params를 await로 처리하여 id 값을 추출
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className={styles.container}>
      {/* 이미지 헤더 */}
      <div className={styles.headerImage}>
        <Image
          src='/images/dummy.jpeg'
          alt='동물보호연합'
          fill
          priority
          className={styles.coverImage}
        />
      </div>

      {/* 단체 정보 */}
      <div className={styles.groupInfoContainer}>
        <div className={styles.groupInfo}>
          <h2 className={styles.groupName}>동물보호연합</h2>
          <p className={styles.groupDescription}>
            더 이상 아프고 다치지 않도록, 다함께 돌보는 공동체
          </p>
        </div>
      </div>

      {/* 클라이언트 컴포넌트로 id 전달 */}
      <GroupDetailClient groupId={id} />
    </div>
  );
}
