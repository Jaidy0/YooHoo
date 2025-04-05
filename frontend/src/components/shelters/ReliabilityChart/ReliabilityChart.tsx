'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  //   ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from './ReliabilityChart.module.scss';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartDataLabels
);

interface ReliabilityChartProps {
  reliability: number;
  reliabilityPercentage: number;
}

export default function ReliabilityChart({
  reliabilityPercentage = 70,
  reliability = 70,
}: ReliabilityChartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.textStatWrapper}>
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>
            이 단체의
            <br />
            후원금 운용 신뢰지수는?
          </h3>
          <p className={styles.description}>
            신뢰지수란 단체와의 운용 결과와 서류 증빙률 등 객관적 지표로 계산된
            수치를 기준으로 산정한 후원금 지표입니다.
          </p>
        </div>
        <div className={styles.statWrapper}>
          <span className={styles.statLabel}>신뢰도 점수</span>
          <span className={styles.statValue}>
            <em>{reliability || 70}</em>점
          </span>
          <span className={styles.statLabel}>/ 100점</span>
        </div>
      </div>
      <div className={styles.chartWrapper} style={{ height: '200px' }}>
        <div className={styles.gaugeChart}>
          {/* 회색 배경 도넛 */}
          <div className={styles.backgroundChart}>
            <Doughnut
              data={{
                datasets: [
                  {
                    data: [100],
                    backgroundColor: ['#EEEEEE'],
                    borderWidth: 1,
                    circumference: 180,
                    rotation: 270,
                    borderRadius: 30,
                    borderColor: ['#EEEEEE'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '78%',
                plugins: {
                  tooltip: { enabled: false },
                  legend: { display: false },
                  datalabels: { display: false },
                },
              }}
            />
          </div>
          {/* 노란색 게이지 도넛 */}
          <div className={styles.foregroundChart}>
            <Doughnut
              data={{
                datasets: [
                  {
                    data: [reliabilityPercentage, 100 - reliabilityPercentage],
                    backgroundColor: ['#FFD600', 'transparent'],
                    borderWidth: 1,
                    circumference: 180,
                    rotation: 270,
                    borderRadius: 30,
                    borderColor: ['#222', 'transparent'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '78%',
                plugins: {
                  tooltip: { enabled: false },
                  legend: { display: false },
                  datalabels: { display: false },
                },
              }}
            />
          </div>
          <div className={styles.centerText}>
            <span className={styles.label}>상위</span>
            <span className={styles.value}>{reliabilityPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
