import React from 'react';
import styles from './ChartLegendBox.module.scss';

interface LegendItem {
  /** 범례 레이블 */
  label: string;
  /** 범례 색상 */
  color: string;
}

interface ChartLegendBoxProps {
  /** 범례 아이템 배열 */
  items: LegendItem[];
  /** 한 줄에 표시할 아이템 개수 */
  itemsPerRow?: 2 | 3;
}

export default function ChartLegendBox({
  items,
  itemsPerRow = 3,
}: ChartLegendBoxProps) {
  return (
    <div className={`${styles.container} ${styles[`grid${itemsPerRow}`]}`}>
      {items.map((item, index) => (
        <div key={index} className={styles.legendItem}>
          <span
            className={styles.colorBox}
            style={{ backgroundColor: item.color }}
          />
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
