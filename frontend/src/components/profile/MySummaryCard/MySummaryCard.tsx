import styles from './MySummaryCard.module.scss';
import Image from 'next/image';

interface MySummaryCardProps {
  /**
   * 카드 제목 (예: "후원한 횟수")
   */
  title: string;

  /**
   * 표시할 값
   */
  value: number;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * 마이페이지의 후원 내역 요약 카드 컴포넌트
 */
export default function MySummaryCard({
  title,
  value,
  className = '',
}: MySummaryCardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
      <div className={styles.imageContainer}>
        <Image
          src={'/images/mySummaryFootprint.png'}
          alt=''
          width={80}
          height={60}
          className={styles.footprintImage}
        />
      </div>
    </div>
  );
}
