'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  // TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './DonationUsageChart.module.scss';
import ChartLegendBox from './ChartLegendBox';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import Badge from '@/components/common/Badge/Badge';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DonationCategory {
  name: string;
  color: string;
  actualPercentage: number;
  averagePercentage: number;
}

interface DonationUsageChartProps {
  categories: DonationCategory[];
  totalIncome: number;
  totalExpense: number;
  year: number;
  month: number;
  day: number;
}

export default function DonationUsageChart({
  categories,
  totalIncome,
  totalExpense,
  year,
  month,
  day,
}: DonationUsageChartProps) {
  const chartData = {
    labels: categories.map((item) => item.name),
    datasets: [
      {
        label: '',
        data: categories.map((item) => item.actualPercentage),
        backgroundColor: categories.map((item) => item.color),
        borderColor: '#999',
        borderWidth: 1,
        // minBarLength: 20,
        borderRadius: 10,
        barThickness: 40,
        maxBarThickness: 30,
      },
      {
        label: '',
        data: categories.map((item) => item.averagePercentage),
        backgroundColor: '#FFFFFF',
        borderColor: '#999',
        borderWidth: 1,
        // minBarLength: 20,
        borderRadius: 10,
        barThickness: 30,
        maxBarThickness: 30,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    font: {
      family: "'NanumSquareNeo', sans-serif", // 기본 폰트 설정
    },
    scales: {
      x: {
        type: 'linear',
        beginAtZero: true,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (tickValue: number | string) {
            return `${tickValue}%`;
          },
          font: {
            family: "'NanumSquareNeo', sans-serif",
            size: 12,
            style: 'normal',
          },
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        // 범례 폰트 설정
        display: false, // 범례 완전히 숨기기
      },
      tooltip: {
        // 툴크 폰트 설정
        titleFont: {
          family: "'Pretendard Variable', sans-serif",
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: "'Pretendard Variable', sans-serif",
          size: 13,
          weight: 'normal',
        },
      },
      datalabels: {
        formatter: function (value: number, context: Context) {
          const datasetIndex = context.datasetIndex;
          const index = context.dataIndex;
          const categoryName = categories[index].name;

          if (datasetIndex === 0) {
            // 실제 사용 퍼센트
            return `${categoryName} ${value}%`;
          } else {
            // 평균 퍼센트
            return `평균 ${value}%`;
          }
        },
        color: function (context: Context) {
          return context.datasetIndex === 0 ? '#000000' : '#666666';
        },
        anchor: 'start',
        align: 'right',
        offset: 0,
        font: {
          family: "'NanumSquareNeo', sans-serif",
          size: 14,
          weight: 600,
          lineHeight: 1.5,
        },

        clamp: true,
        padding: {
          top: 0,
          bottom: 0,
          left: 20,
          right: 0,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20, // 라벨이 잘리지 않도록 여백 증가
      },
    },
  };

  const legendItems = [
    { label: '항목별 전체 평균', color: '#FFFFFF' },
    ...categories.map((item) => ({
      label: item.name,
      color: item.color,
    })),
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className={styles.containerWrap}>
      <div className={styles.container}>
        <div className={styles.summaryContainer}>
          <h4 className={styles.chartTitle}>요약</h4>
          <div className={styles.summary}>
            <div className={styles.amountBox}>
              <div className={styles.amount}>
                <Badge variant='positive'>수입</Badge>
                <span className={styles.value}>
                  {formatCurrency(totalIncome)}
                </span>
              </div>
              <div className={styles.amount}>
                <Badge variant='negative'>지출</Badge>
                <span className={styles.value}>
                  {formatCurrency(totalExpense)}
                </span>
              </div>
              <div className={styles.total}>
                <span className={styles.label}>총 잔액</span>
                <span className={styles.value}>
                  {formatCurrency(totalIncome - totalExpense)}
                </span>
              </div>
            </div>
            <p className={styles.date}>
              {year}년 {month}월 {day}일 오늘 기준
            </p>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <h4 className={styles.chartTitle}>후원금 사용 내역별 비율</h4>
          <ChartLegendBox items={legendItems} itemsPerRow={2} />

          <div className={styles.chartWrapper}>
            <Bar
              data={chartData}
              options={options}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
