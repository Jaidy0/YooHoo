'use client';

import React from 'react';
import styles from './ReliabilityChart.module.scss';

interface ReliabilityChartProps {
  reliability: number;
  dogScore: number;
  fileScore: number;
  foundationScore: number;
}

export default function ReliabilityChart({
  dogScore = 0,
  fileScore = 0,
  foundationScore = 0,
  reliability = 0,
}: ReliabilityChartProps) {
  // 각 항목의 최대 점수
  const MAX_DOG_SCORE = 50;
  const MAX_FILE_SCORE = 30;
  const MAX_FOUNDATION_SCORE = 20;
  const MAX_TOTAL = 100;

  // 각 항목의 퍼센티지 계산 (0-100 사이 값으로 제한)

  const totalPercentage = Math.min(
    100,
    Math.max(0, (reliability / MAX_TOTAL) * 100)
  );

  // 항목별 실제 달성도 계산
  const dogActualWidth = (dogScore / MAX_TOTAL) * 100;
  const fileActualWidth = (fileScore / MAX_TOTAL) * 100;
  const foundationActualWidth = (foundationScore / MAX_TOTAL) * 100;

  return (
    <div className={styles.container}>
      {/* 메인 차트 영역 */}
      <div className={styles.chartContainer}>
        {/* 사용 현황 정보 표시 */}

        {/* 통합 막대 그래프 (맥 스토리지 스타일) */}
        <div className={styles.combinedBarContainer}>
          <div className={styles.usageInfo}>
            <div className={styles.usageTitle}>
              {/* <span className={styles.usageTitleText}>신뢰도</span> */}
              <span className={styles.reliability}>
                {reliability || 0}
              </span>/ {MAX_TOTAL}점
            </div>
          </div>
          <div className={styles.combinedBarWrapper}>
            {/* 강아지 관리 영역 */}
            <div
              className={styles.combinedBarSection}
              style={{
                width: `${dogActualWidth}%`,
                backgroundColor: 'var(--chart-hotpink)', // 빨강
              }}
              title={`강아지 관리: ${dogScore}/${MAX_DOG_SCORE}점`}
            />

            {/* 서류 증빙률 영역 */}
            <div
              className={styles.combinedBarSection}
              style={{
                width: `${fileActualWidth}%`,
                backgroundColor: 'var(--chart-yellow)', // 주황/노랑
              }}
              title={`서류 증빙률: ${fileScore}/${MAX_FILE_SCORE}점`}
            />

            {/* 재단 운영 영역 */}
            <div
              className={styles.combinedBarSection}
              style={{
                width: `${foundationActualWidth}%`,
                backgroundColor: 'var(--chart-green)', // 초록
              }}
              title={`재단 운영: ${foundationScore}/${MAX_FOUNDATION_SCORE}점`}
            />

            {/* 빈 영역 (남은 부분) */}
            <div
              className={styles.combinedBarSection}
              style={{
                width: `${100 - totalPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* 범례 */}
        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: 'var(--chart-hotpink)' }}
            ></div>
            <div className={styles.legendText}>
              강아지 관리 ({dogScore}/{MAX_DOG_SCORE}점)
            </div>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: 'var(--chart-yellow)' }}
            ></div>
            <div className={styles.legendText}>
              서류 증빙률 ({fileScore}/{MAX_FILE_SCORE}점)
            </div>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: 'var(--chart-green)' }}
            ></div>
            <div className={styles.legendText}>
              재단 운영 ({foundationScore}/{MAX_FOUNDATION_SCORE}점)
            </div>
          </div>
          <div className={styles.legendItem}></div>
        </div>
      </div>
    </div>
  );
}
