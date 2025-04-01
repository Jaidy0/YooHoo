import React from 'react';
import Image from 'next/image';
import styles from './ShelterCard.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

interface ShelterCardProps {
  /** 보호소 이미지 URL */
  imageUrl: string;
  /** 보호소 이름 */
  title: string;
  /** 보호소 설명 */
  description: string;
  /** 강아지 수 */
  dogCount: number;
  /** 좋아요 수 */
  reliability: number;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 카드 클래스 이름 */
  className?: string;
}

export default function ShelterCard({
  imageUrl,
  title,
  description,
  dogCount = 0,
  reliability = 0,
  onClick,
  className,
}: ShelterCardProps) {
  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role='button'
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl || '/images/dummy.jpeg'}
          width={100}
          height={100}
          alt={title}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.stats}>
          <RoundButton className={styles.iconBtn} variant='primary'>
            <IconBox name='dog' size={20} color='var(--yh-brown)' />
            <span>{dogCount ?? 0}</span>
          </RoundButton>
          <RoundButton className={styles.iconBtn} variant='primary'>
            <IconBox name='smile' size={20} color='var(--chart-yellow)' />
            <span>{reliability ?? 0}</span>
          </RoundButton>
        </div>
      </div>
    </div>
  );
}
