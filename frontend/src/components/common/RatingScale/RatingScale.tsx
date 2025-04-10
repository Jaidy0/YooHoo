import { useState } from 'react';
import styles from './RatingScale.module.scss';

export interface RatingScaleProps {
  /**
   * 최대 평점 값
   * @default 5
   */
  maxRating?: number;

  /**
   * 현재 선택된 평점
   * @default 0
   */
  value?: number;

  /**
   * 평점 변경 시 호출될 함수
   */
  onChange?: (value: number) => void;

  /**
   * 읽기 전용 모드 여부
   * @default false
   */
  readOnly?: boolean;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * 평점이나 등급을 시각적으로 표시하는 컴포넌트
 */
export default function RatingScale({
  maxRating = 5,
  value = 0,
  onChange,
  readOnly = false,
  className = '',
}: RatingScaleProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // 클릭 핸들러
  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  // 마우스 호버 이벤트 핸들러
  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  // 마우스 떠남 이벤트 핸들러
  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  // 현재 표시할 평점 (호버 중이면 호버 값, 아니면 실제 값)
  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={`${styles.ratingScale} ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxRating }, (_, index) => index + 1).map(
        (rating) => (
          <button
            key={rating}
            type='button'
            className={`${styles.ratingButton} global-rating-button ${displayValue >= rating ? styles.active : ''}`}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            disabled={readOnly}
            aria-label={`${rating} 점`}
          />
        )
      )}
    </div>
  );
}
