import React from 'react';
import Image from 'next/image';
import styles from './DogCard.module.scss';
import { Dog, Gender, DogStatus } from '@/types/dog';

export interface DogCardProps {
  dog: Dog;
  onClick?: (dogId: number) => void;
  // 라우팅 여부를 결정하는 프롭
  disableRouting?: boolean;
}

export default function DogCard({
  dog,
  onClick,
  disableRouting = false,
}: DogCardProps) {
  const { dogId, name, age, gender, status, imageUrl } = dog;

  const genderText = gender === Gender.MALE ? '남' : '여';

  // 상태에 따른 텍스트와 클래스
  const getStatusInfo = (status: DogStatus) => {
    switch (status) {
      case DogStatus.PROTECTED:
        return { text: '보호 중', className: styles.statusProtected };
      case DogStatus.TEMPORARY:
        return { text: '임시보호 중', className: styles.statusTemporary };
      case DogStatus.ADOPTED:
        return { text: '입양 완료', className: styles.statusAdopted };
      case DogStatus.DECEASED:
        return { text: '사망', className: styles.statusDeceased };
      default:
        return { text: '상태 미상', className: '' };
    }
  };

  const statusInfo = getStatusInfo(status);

  // 기본 이미지 URL (이미지가 없을 경우)
  const dogImageUrl = imageUrl || '/images/dummy.jpeg';

  // 카드 클릭 핸들러
  const handleCardClick = (e: React.MouseEvent) => {
    if (disableRouting) {
      // 기본 동작 방지 (라우팅 방지)
      e.preventDefault();
    }

    if (onClick) {
      onClick(dogId);
    }
  };

  // 내용 렌더링 함수
  const renderCardContent = () => (
    <div className={styles.contentWrapper}>
      {/* 이미지 컨테이너 */}
      <div className={styles.imageContainer}>
        <Image
          src={dogImageUrl}
          alt={`${name} 사진`}
          width={190}
          height={190}
          className={styles.dogImage}
          priority
        />
      </div>

      {/* 개 정보 */}
      <div className={styles.dogInfo}>
        <div className={styles.dogDetails}>
          <div className={styles.detailsRow}>
            <span className={styles.dogName}>{name}</span>
            <span className={styles.dogAgeGender}>
              {age}세 / {genderText}
            </span>
          </div>
        </div>

        <div className={styles.badgeContainer}>
          <span className={`${styles.statusBadge} ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>
    </div>
  );

  // disableRouting이 true면 단순 div로 렌더링
  if (disableRouting) {
    return (
      <div className={styles.dogCard} onClick={handleCardClick}>
        {renderCardContent()}
      </div>
    );
  }

  // 그렇지 않으면 원래대로 Link로 감싸진 형태로 렌더링
  return (
    <div className={styles.dogCard} onClick={handleCardClick}>
      <a href={`/dogs/${dogId}`} className={styles.cardLink}>
        {renderCardContent()}
      </a>
    </div>
  );
}
