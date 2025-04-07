'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';
import styles from './DonationChart.module.scss';

// Chart.js 등록
ChartJS.register(...registerables, ChartDataLabels);

interface StatItem {
  month: string;
  value: number;
}

interface DonationChartProps {
  donationStats: StatItem[];
  withdrawalStats: StatItem[];
}

export default function DonationChart({
  donationStats,
  withdrawalStats,
}: DonationChartProps) {
  const incomeChartRef = useRef<HTMLCanvasElement>(null);
  const expenseChartRef = useRef<HTMLCanvasElement>(null);

  // 숫자 포맷팅 함수
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  useEffect(() => {
    let incomeChartInstance: Chart | undefined;
    let expenseChartInstance: Chart | undefined;

    // 차트 인스턴스 정리 함수
    const cleanup = () => {
      if (incomeChartInstance) {
        incomeChartInstance.destroy();
      }
      if (expenseChartInstance) {
        expenseChartInstance.destroy();
      }
    };

    // 기존 차트 인스턴스 정리
    cleanup();

    // 수입 차트 생성
    if (incomeChartRef.current) {
      const ctx = incomeChartRef.current.getContext('2d');
      if (ctx) {
        incomeChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: donationStats.map((item) => item.month),
            datasets: [
              {
                label: '수입',
                data: donationStats.map((item) => item.value),
                backgroundColor: donationStats.map((_, index) => {
                  const totalItems = donationStats.length;
                  if (index === totalItems - 2) return '#fee101'; // 현재 달(3월)은 노란색
                  if (index === totalItems - 1) return '#ff544c'; // 예측 값(다음달)은 주황색
                  return '#f6f4e8'; // 나머지는 연한 베이지색
                }),
                borderColor: '#333',
                borderWidth: 1,
                borderRadius: 15,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 30, // 상단 패딩 추가
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${formatNumber(context.parsed.y)}원`;
                  },
                },
              },
              datalabels: {
                display: true,
                align: 'top',
                anchor: 'end',
                color: '#777',
                formatter: (value) => {
                  return formatNumber(value);
                },
                font: {
                  weight: 'normal',
                  size: 13,
                },
                padding: {
                  bottom: 8,
                },
                // 레이블 오프셋 설정
                offset: 5,
              },
            },
            scales: {
              y: {
                display: false,
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    // 지출 차트 생성
    if (expenseChartRef.current) {
      const ctx = expenseChartRef.current.getContext('2d');
      if (ctx) {
        expenseChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: withdrawalStats.map((item) => item.month),
            datasets: [
              {
                label: '지출',
                data: withdrawalStats.map((item) => item.value),
                backgroundColor: withdrawalStats.map((_, index) => {
                  const totalItems = withdrawalStats.length;
                  if (index === totalItems - 2) return '#fee101'; // 현재 달(3월)은 노란색
                  if (index === totalItems - 1) return '#ff544c'; // 예측 값(다음달)은 주황색
                  return '#f6f4e8'; // 나머지는 연한 베이지색
                }),
                borderColor: '#333',
                borderWidth: 1,
                borderRadius: 15,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 30, // 상단 패딩 추가
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${formatNumber(context.parsed.y)}원`;
                  },
                },
              },
              datalabels: {
                display: true,
                align: 'top',
                anchor: 'end',
                color: '#777',
                formatter: (value) => {
                  return formatNumber(value);
                },
                font: {
                  weight: 'normal',
                  size: 13,
                },
                padding: {
                  bottom: 8,
                },
                // 레이블 오프셋 설정
                offset: 5,
              },
            },
            scales: {
              y: {
                display: false,
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
    return cleanup;
  }, [donationStats, withdrawalStats]);

  return (
    <div className={styles.chartsContainer}>
      {/* 수입 차트 */}
      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>수입</div>
        <div className={styles.chartWrapper}>
          <canvas ref={incomeChartRef} />
        </div>
      </div>

      {/* 지출 차트 */}
      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>지출</div>
        <div className={styles.chartWrapper}>
          <canvas ref={expenseChartRef} />
        </div>
      </div>
    </div>
  );
}
