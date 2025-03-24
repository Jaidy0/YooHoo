import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './DogCard.module.scss';
import { DogSummary, Gender, DogStatus } from '@/types/dog';

export interface DogCardProps {
  dog: DogSummary;
  onClick?: (dogId: number) => void;
}

export default function DogCard({ dog, onClick }: DogCardProps) {
  const { dogId, name, age, gender, status, mainImage } = dog;

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
  // TODO: 더미 이미지 교체
  const imageUrl =
    mainImage?.imageUrl ||
    'https://dummyimage.com/600x400/000/fcfcfc&text=yoohoo';

  // 카드 클릭 핸들러
  const handleCardClick = () => {
    if (onClick) {
      onClick(dogId);
    }
  };

  return (
    <div className={styles.dogCard} onClick={handleCardClick}>
      <Link href={`/dogs/${dogId}`} className={styles.cardLink}>
        <div className={styles.contentWrapper}>
          {/* 이미지 컨테이너 */}
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={`${name} 사진`}
              width={190}
              height={190}
              className={styles.dogImage}
              priority
            />
          </div>

          {/* 뱃지 */}

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
      </Link>
    </div>
  );
}
