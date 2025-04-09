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

  // 숫자 포맷팅 함수들
  const formatToManwon = (value: number): string => {
    // 원 단위를 만원 단위로 변환 (소수점 없이 반올림)
    const valueInManwon = Math.round(value / 10000);
    return `${valueInManwon}만`;
  };

  const formatToWon = (value: number, isPredict = false): string => {
    // 예측값인 경우 10원 단위로 반올림
    if (isPredict) {
      const roundedValue = Math.round(value / 10) * 10;
      return new Intl.NumberFormat('ko-KR').format(roundedValue) + '원';
    }
    // 일반 값은 그대로 표시
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
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
          type: 'line',
          data: {
            labels: donationStats.map((item) => item.month),
            datasets: [
              {
                label: '수입',
                data: donationStats.map((item) => item.value),
                borderColor: '#7c514d', // 브랜드 색상 사용(yh-brown)
                backgroundColor: 'rgba(254, 225, 1, 0.1)', // 노란색 배경(yh-yellow)
                fill: true,
                tension: 0.3, // 곡선 부드러움 설정
                pointBackgroundColor: donationStats.map((_, index) => {
                  const totalItems = donationStats.length;
                  if (index === totalItems - 2) return '#fee101'; // 현재 달은 노란색
                  if (index === totalItems - 1) return '#ff544c'; // 예측 값은 주황색
                  return '#7c514d'; // 나머지는 기본 색상
                }),
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                borderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 30, // 상단 패딩 추가
                right: 20, // 오른쪽 패딩 추가 (선 그래프에 필요)
                left: 20, // 왼쪽 패딩 추가
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    // 마지막 데이터 포인트(예측값)인지 확인
                    const isPredict =
                      context.dataIndex === context.dataset.data.length - 1;
                    return formatToWon(context.parsed.y, isPredict);
                  },
                },
              },
              datalabels: {
                display: true,
                align: 'top',
                anchor: 'end',
                color: '#777',
                formatter: (value, context) => {
                  return formatToManwon(value);
                },
                font: {
                  weight: 'normal',
                  size: 12,
                  family: "'NanumSquareNeo-Variable', sans-serif",
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
                ticks: {
                  font: {
                    family: "'NanumSquareNeo-Variable', sans-serif",
                  },
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
          type: 'line',
          data: {
            labels: withdrawalStats.map((item) => item.month),
            datasets: [
              {
                label: '지출',
                data: withdrawalStats.map((item) => item.value),
                borderColor: '#7c514d', // 갈색 선
                backgroundColor: 'rgba(253, 186, 160, 0.1)', // 복숭아색 배경(yh-peach)
                fill: true,
                tension: 0.3, // 곡선 부드러움 설정
                pointBackgroundColor: withdrawalStats.map((_, index) => {
                  const totalItems = withdrawalStats.length;
                  if (index === totalItems - 2) return '#fee101'; // 현재 달은 노란색
                  if (index === totalItems - 1) return '#ff544c'; // 예측 값은 주황색
                  return '#7c514d'; // 나머지는 기본 색상
                }),
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                borderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 30, // 상단 패딩 추가
                right: 20, // 오른쪽 패딩 추가
                left: 20, // 왼쪽 패딩 추가
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    // 마지막 데이터 포인트(예측값)인지 확인
                    const isPredict =
                      context.dataIndex === context.dataset.data.length - 1;
                    return formatToWon(context.parsed.y, isPredict);
                  },
                },
              },
              datalabels: {
                display: true,
                align: 'top',
                anchor: 'end',
                color: '#777',
                formatter: (value, context) => {
                  return formatToManwon(value);
                },
                font: {
                  weight: 'normal',
                  size: 12,
                  family: "'NanumSquareNeo-Variable', sans-serif",
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
                ticks: {
                  font: {
                    family: "'NanumSquareNeo-Variable', sans-serif",
                  },
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
