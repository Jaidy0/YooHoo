import Image from 'next/image';
import styles from './DogCard.module.scss';

type DogCardProps = {
  id: number;
  name: string;
  imageUrl?: string;
  isSelected?: boolean;
  onClick: (id: number, name: string) => void;
};

export default function DogCard({
  id,
  name,
  imageUrl,
  isSelected = false,
  onClick,
}: DogCardProps) {
  const handleClick = () => {
    onClick(id, name);
  };

  return (
    <div
      className={`${styles.dogCard} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl || '/images/dummy.jpeg'}
          alt={name}
          width={100}
          height={100}
          className={styles.dogImage}
        />
      </div>
      <span className={styles.dogName}>{name}</span>
    </div>
  );
}
