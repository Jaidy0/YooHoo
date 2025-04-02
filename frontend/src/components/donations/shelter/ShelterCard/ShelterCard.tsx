import React from 'react';
import Image from 'next/image';
import styles from './ShelterCard.module.scss';

type ShelterCardProps = {
  id: number;
  name: string;
  imageUrl?: string;
  isSelected?: boolean;
  isRecent?: boolean; // 최근 후원 여부
  onClick: (id: number, name: string) => void;
};

function ShelterCard({
  id,
  name,
  imageUrl = '',
  isSelected = false,
  isRecent = false,
  onClick,
}: ShelterCardProps) {
  const handleClick = () => {
    onClick(id, name);
  };

  return (
    <div
      className={`${styles.shelterCard} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl || '/images/dummy.jpeg'}
          alt={name}
          width={64}
          height={64}
          className={styles.shelterImage}
        />
      </div>
      <div className={styles.shelterInfo}>
        {isRecent && <span className={styles.recentLabel}>최근 후원</span>}
        <span className={styles.shelterName}>{name}</span>
      </div>
    </div>
  );
}

export default ShelterCard;
