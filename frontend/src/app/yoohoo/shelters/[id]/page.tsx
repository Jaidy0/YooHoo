import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/common/buttons/Button/Button';
import GroupDetailClient from './client';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '단체 상세 | 유기견 후원 플랫폼',
  description: '유기견 보호 단체 상세 정보 페이지입니다.',
};

export default function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className={styles.container}>
      {/* 이미지 헤더 */}
      <div className={styles.headerImage}>
        <div className={styles.backButtonContainer}>
          <Link href='/yoohoo/shelters' className={styles.backButton}>
            ←
          </Link>
          <h1 className={styles.pageTitle}>후원 단체 리스트</h1>
        </div>
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

      {/* 후원 버튼 */}
      <div className={styles.donateButtonWrapper}>
        <Button variant='primary' size='lg' className={styles.donateButton}>
          후원 하기
        </Button>
      </div>

      {/* 탭 컨텐츠 - 클라이언트 컴포넌트로 분리 */}
      <GroupDetailClient groupId={params.id} />
    </div>
  );
}
