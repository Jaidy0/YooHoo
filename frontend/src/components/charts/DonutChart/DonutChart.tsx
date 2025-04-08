'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './DonutChart.module.scss';

interface DonutChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  centerText?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  description?: React.ReactNode;
}

export default function DonutChart({
  data,
  centerText,
  className = '',
  isLoading = false,
  description,
}: DonutChartProps) {
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

    // 차트 색상
    const chartColors = [
      getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-orange')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-yellow')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-hotpink')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-blue')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-green')
        .trim(),
      getComputedStyle(document.documentElement)
        .getPropertyValue('--chart-pink')
        .trim(),
    ];

    // 데이터 개수에 맞게 색상 배열 생성
    const colors = data.labels.map(
      (_, index) => chartColors[index % chartColors.length]
    );

    // 차트 생성
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: colors,
            borderColor: '#333',
            borderWidth: 1,
            borderRadius: 15,
          },
        ],
      },
      options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw as number;
                return `${label}: ${value}건`;
              },
            },
            position: 'nearest',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 8,
            titleFont: {
              size: 12,
            },
            bodyFont: {
              size: 12,
            },
            displayColors: true,
            caretSize: 6,
            // 툴팁이 차트 컨테이너 밖으로 나가지 않도록 설정
            // charts.js에서는 차트영역 밖으로 나가지 않도록 자동 조정됨
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLoading]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div
        className={`${styles.donutChartContainer} ${className} ${styles.loading}`}
      >
        <div className={styles.loadingIndicator}>로딩 중...</div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data.values.length) {
    return (
      <div
        className={`${styles.donutChartContainer} ${className} ${styles.noData}`}
      >
        <div className={styles.noDataMessage}>데이터가 없습니다.</div>
      </div>
    );
  }

  // 총 값 계산
  const total = data.values.reduce((sum, val) => sum + val, 0);

  // 차트 색상
  const chartColorNames = [
    'orange',
    'yellow',
    'hotpink',
    'blue',
    'green',
    'pink',
  ];

  return (
    <div className={`${styles.donutChartContainer} ${className}`}>
      <div className={styles.topContent}>
        <div className={styles.descriptionWithLegend}>
          {description && (
            <div className={styles.descriptionBox}>{description}</div>
          )}
          <div className={styles.legend}>
            {data.labels.map((label, index) => {
              const percentage =
                total > 0 ? Math.round((data.values[index] / total) * 100) : 0;
              const colorName = chartColorNames[index % chartColorNames.length];
              return (
                <div key={index} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{
                      backgroundColor: `var(--chart-${colorName})`,
                      border: '1px solid #000',
                    }}
                  ></span>
                  <span className={styles.legendLabel}>
                    {label}: {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.chartWrapper}>
          <canvas ref={chartRef}></canvas>
          {centerText && <div className={styles.centerText}>{centerText}</div>}
        </div>
      </div>
    </div>
  );
}
