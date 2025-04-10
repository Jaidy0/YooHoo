import React, { useRef, useEffect } from 'react';
import styles from './TrustTooltip.module.scss';

interface TrustTooltipProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function TrustTooltip({ isOpen, onToggle }: TrustTooltipProps) {
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
          <h4>신뢰 지수란?</h4>
          <p>
            단체 신뢰 지수는 보호소의 투명성과 신뢰성을 나타내는 지표입니다.
          </p>

          <h4>🔍 신뢰 지수는 이렇게 계산해요!</h4>
          <ul>
            <li>1. 후원금 중 강아지 관련 지출 비율</li>
            <li>2. 출금 내역에 활동 자료가 첨부된 비율</li>
            <li>3. 설립 후 운영된 연수</li>
          </ul>

          <p>총 100점 만점 기준으로 산정되며, 실시간으로 갱신됩니다</p>
        </div>
      )}
    </div>
  );
}
