'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './BarChart.module.scss';

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  className?: string;
  isLoading?: boolean;
  unit?: string;
  highlightIndex?: number;
  description?: string;
}

export default function BarChart({
  data,
  className = '',
  isLoading = false,
  unit = '건',
  highlightIndex,
  description,
}: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || isLoading || !data.values.length) return;

    // 이전 차트 인스턴스 제거
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const baseColor = style.getPropertyValue('--yh-ivory').trim();
    const highlightColor = style.getPropertyValue('--yh-yellow').trim();

    // 강조할 인덱스 설정 (기본값: 마지막 인덱스)
    const highlight =
      highlightIndex !== undefined ? highlightIndex : data.labels.length - 1;

    // 색상 배열 생성
    const backgroundColor = data.labels.map((_, index) =>
      index === highlight ? highlightColor : baseColor
    );

    // 차트 생성
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: backgroundColor,
            borderColor: '#000',
            borderWidth: 1,
            borderRadius: 10,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x', // 세로형 차트
        layout: {
          padding: {
            top: 10,
          },
        },
        scales: {
          x: {
            display: false, // x축 레이블 숨기기
            grid: {
              display: false,
            },
          },
          y: {
            display: false, // y축 레이블 숨기기
            grid: {
              display: false, // 그리드 숨기기
            },
            beginAtZero: true,
            suggestedMax: Math.max(...data.values) * 1.1,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.raw} ${unit}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLoading, unit, highlightIndex]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div
        className={`${styles.barChartContainer} ${className} ${styles.loading}`}
      >
        <div className={styles.loadingIndicator}>로딩 중...</div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data.values.length) {
    return (
      <div
        className={`${styles.barChartContainer} ${className} ${styles.noData}`}
      >
        <div className={styles.noDataMessage}>데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={`${styles.barChartContainer} ${className}`}>
      {description && (
        <div className={styles.chartDescription}>{description}</div>
      )}
      <div className={styles.chartWrapper}>
        <canvas ref={chartRef}></canvas>
      </div>
      <div className={styles.legend}>
        {data.labels.map((label, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={index === highlightIndex ? styles.highlighted : ''}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
