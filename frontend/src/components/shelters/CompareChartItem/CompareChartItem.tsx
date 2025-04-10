import React from 'react';
import styles from './CompareChartItem.module.scss';

interface CompareChartItemProps {
  /** 첫 번째 항목 레이블 */
  label1: string;
  /** 두 번째 항목 레이블 */
  label2: string;
  /** 첫 번째 항목 값 (%) */
  value1: number;
  /** 두 번째 항목 값 (%) */
  value2: number;
  /** 차트 높이 */
  height?: number;
}

export default function CompareChartItem({
  label1,
  label2,
  value1,
  value2,
  height = 36,
}: CompareChartItemProps) {
  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.baseBar}>
        <div className={styles.bar1} style={{ width: `${value1}%` }}>
          <span className={styles.label}>
            {label1} {value1}%
          </span>
        </div>
      </div>
      <div className={styles.baseBar}>
        <div className={styles.bar2} style={{ width: `${value2}%` }}>
          <span className={styles.label}>
            {label2} {value2}%
          </span>
        </div>
      </div>
    </div>
  );
}
