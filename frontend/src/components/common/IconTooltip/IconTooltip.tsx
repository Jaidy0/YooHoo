import React, { useRef, useEffect } from 'react';
import styles from './IconTooltip.module.scss';
import IconBox from '../IconBox/IconBox';

interface TrustTooltipProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function IconTooltip({ isOpen, onToggle }: TrustTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 툴팁 외부 클릭 && 버튼 외부 클릭일 때만 닫기
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      // mousedown이 아닌 mouseup 이벤트 사용
      document.addEventListener('mouseup', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className={styles.tooltipWrapper}>
      <button
        className={styles.questionButton}
        onClick={onToggle}
        ref={buttonRef}
      >
        ?
      </button>
      {isOpen && (
        <div className={styles.tooltip} ref={tooltipRef}>
          <h4>아이콘은 이런 의미에요 🐶</h4>
          <p className={styles.tooltipItem}>
            <IconBox name='dog' size={20} color='var(--yh-brown)' />
            단체를 거쳐간 강아지 수
          </p>
          <p className={styles.tooltipItem}>
            <IconBox name='smile' size={20} color='var(--chart-yellow)' />
            단체의 신뢰 지수
          </p>
        </div>
      )}
    </div>
  );
}
