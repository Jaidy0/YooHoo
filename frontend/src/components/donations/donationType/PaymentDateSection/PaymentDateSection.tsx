'use client';

import { useState } from 'react';
import StepTitle from '@/components/donations/StepTitle/StepTitle';
import styles from './PaymentDateSection.module.scss';
import { IconBox } from '@/components/common/IconBox/IconBox';

type PaymentDateSectionProps = {
  stepNumber: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

export default function PaymentDateSection({
  stepNumber,
  selectedDay,
  onSelectDay,
}: PaymentDateSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 오늘 날짜 기준으로 첫 결제일
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  };

  const today = new Date();
  const firstPaymentDate = formatDate(today);

  // 다음 정기 결제일 계산 (선택한 날짜 기준으로 다음 달)
  const getNextRegularPaymentDate = () => {
    if (!selectedDay) return '';

    // 다음 달의 선택한 날짜로 설정
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      selectedDay
    );
    return formatDate(nextMonth);
  };

  // 선택 가능한 날짜 리스트 (1일부터 28일까지)
  const availableDays = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className={styles.paymentDateSection}>
      <StepTitle number={stepNumber} title='정기 결제일 선택' />

      <div className={styles.dateSelector}>
        <div className={styles.dropdownWrapper}>
          <div
            className={styles.dropdown}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {selectedDay ? `매월 ${selectedDay}일` : '날짜를 선택해주세요'}
            </span>
            <div
              className={`${styles.chevronIcon} ${isDropdownOpen ? styles.rotated : ''}`}
            >
              <IconBox name='chevron' size={16} />
            </div>
          </div>

          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {availableDays.map((day) => (
                <li
                  key={day}
                  className={day === selectedDay ? styles.selected : ''}
                  onClick={() => {
                    onSelectDay(day);
                    setIsDropdownOpen(false);
                  }}
                >
                  {day}일
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 다음 정기 결제 정보 표시 */}
        {selectedDay > 0 && (
          <div className={styles.paymentInfoContainer}>
            <div className={styles.paymentInfo}>
              <div className={styles.label}>다음 결제일:</div>
              <div className={styles.date}>{getNextRegularPaymentDate()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
