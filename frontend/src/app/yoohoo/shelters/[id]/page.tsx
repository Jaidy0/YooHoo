import { Metadata } from 'next';
import Image from 'next/image';
import GroupDetailClient from './client';
import styles from './page.module.scss';
import { getShelterDetail } from '@/api/shelter/shelter';

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

  // 서버 사이드에서 shelter 데이터 가져오기
  const shelter = await getShelterDetail(Number(id));

  return (
    <div className={styles.container}>
      {/* 이미지 헤더 */}
      <div className={styles.headerImage}>
        <Image
          src={shelter?.imageUrl || '/images/dummy.jpeg'}
          alt={shelter?.name || '보호소 이미지'}
          fill
          priority
          className={styles.coverImage}
        />
      </div>

      {/* 단체 정보 */}
      <div className={styles.groupInfoContainer}>
        <div className={styles.groupInfo}>
          <h2 className={styles.groupName}>{shelter?.name}</h2>
        </div>
      </div>

      {/* 클라이언트 컴포넌트로 shelter 데이터 전달 */}
      <GroupDetailClient groupId={id} />
    </div>
  );
}
