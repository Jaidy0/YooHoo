'use client';

import styles from './SelectSection.module.scss';
import StepTitle from '@/components/donations/StepTitle/StepTitle';
import SelectCard from '@/components/common/SelectCard/SelectCard';
import { IconBox } from '@/components/common/IconBox/IconBox';

// 선택 타입 정의
export type DonationType = 0 | 1; // 0: 정기후원, 1: 일시후원
export type TargetType = 'shelter' | 'dog';

type SelectSectionProps = {
  step: 'donationType' | 'targetType'; // 표시할 단계: 후원 방식 또는 후원 대상
  stepNumber: number; // 단계 번호
  selectedValue: DonationType | TargetType; // 현재 선택된 값
  onSelect: (value: DonationType | TargetType) => void; // 선택 콜백
};

export default function SelectSection({
  step,
  stepNumber,
  selectedValue,
  onSelect,
}: SelectSectionProps) {
  // 정기/일시 후원 선택 렌더링
  const renderDonationTypeSelection = () => {
    const currentValue = selectedValue as DonationType;

    return (
      <>
        <StepTitle number={stepNumber} title='후원 방식 선택' />

        <div className={styles.description}>
          <p>
            <strong>일시후원</strong> 단체 후원 / 강아지 후원 중 선택하여
            후원합니다.
          </p>
          <p>
            <strong>정기후원</strong> 매월 정해진 날짜마다 후원금이 이체됩니다.
          </p>
        </div>

        <div className={styles.cardRow}>
          <SelectCard
            title='일시 후원'
            description='한 번만 후원합니다'
            icon={
              <IconBox
                name='heart'
                size={24}
                color={currentValue === 1 ? '#ff544c' : '#999'}
              />
            }
            isSelected={currentValue === 1}
            onClick={() => onSelect(1 as DonationType)}
            borderType={currentValue === 1 ? 'none' : 'gray'}
            className={styles.selectCard}
          />
          <SelectCard
            title='정기 후원'
            description='매월 지정일에 후원합니다'
            icon={
              <IconBox
                name='calendar'
                size={24}
                color={currentValue === 0 ? '#ff544c' : '#999'}
              />
            }
            isSelected={currentValue === 0}
            onClick={() => onSelect(0 as DonationType)}
            borderType={currentValue === 0 ? 'none' : 'gray'}
            className={styles.selectCard}
          />
        </div>
      </>
    );
  };

  // 단체/강아지 후원 선택 렌더링
  const renderTargetTypeSelection = () => {
    const currentValue = selectedValue as TargetType;

    return (
      <>
        <StepTitle number={stepNumber} title='후원 대상 선택' />

        <div className={styles.cardRow}>
          <SelectCard
            title='단체 후원'
            description='단체 전체를 후원합니다'
            icon={
              <IconBox
                name='dog'
                size={24}
                color={currentValue === 'shelter' ? '#ff544c' : '#999'}
              />
            }
            isSelected={currentValue === 'shelter'}
            onClick={() => onSelect('shelter' as TargetType)}
            borderType={currentValue === 'shelter' ? 'none' : 'gray'}
            className={styles.selectCard}
          />

          <SelectCard
            title='강아지 후원'
            description='특정 강아지를 후원합니다'
            icon={
              <IconBox
                name='doghead'
                size={24}
                color={currentValue === 'dog' ? '#ff544c' : '#999'}
              />
            }
            isSelected={currentValue === 'dog'}
            onClick={() => onSelect('dog' as TargetType)}
            borderType={currentValue === 'dog' ? 'none' : 'gray'}
            className={styles.selectCard}
          />
        </div>
      </>
    );
  };

  return (
    <div className={styles.selectSection}>
      {step === 'donationType'
        ? renderDonationTypeSelection()
        : renderTargetTypeSelection()}
    </div>
  );
}
