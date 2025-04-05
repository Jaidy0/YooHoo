'use client';

import { useState } from 'react';
import styles from './AmountSection.module.scss';
import StepTitle from '@/components/donations/StepTitle/StepTitle';

type AmountSectionProps = {
  stepNumber: number;
  currentAmount: number;
  updateFormData: (data: Partial<{ amount: number }>) => void;
  completeStep: (step: 'amount', isCompleted?: boolean) => void;
};

// 금액 증가 버튼 옵션
const AMOUNT_BUTTONS = [1000, 5000, 10000, 100000];

export default function AmountSection({
  stepNumber,
  currentAmount,
  updateFormData,
  completeStep,
}: AmountSectionProps) {
  const [amount, setAmount] = useState<number>(currentAmount || 0);

  const handleAmountIncrease = (value: number) => {
    const newAmount = amount + value;
    setAmount(newAmount);
    updateFormData({ amount: newAmount });
    completeStep('amount', newAmount > 0);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numericAmount = value ? parseInt(value, 10) : 0;

    setAmount(numericAmount);
    updateFormData({ amount: numericAmount });
    completeStep('amount', numericAmount > 0);
  };

  return (
    <div className={styles.amountSection}>
      <StepTitle number={stepNumber} title='후원 금액 설정' />

      <div className={styles.amountInputContainer}>
        <div className={styles.amountInputHeader}>
          <h3>후원 금액 입력</h3>
          <button
            type='button'
            className={styles.resetButton}
            onClick={() => {
              setAmount(0);
              updateFormData({ amount: 0 });
              completeStep('amount', false);
            }}
          >
            초기화
          </button>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type='text'
            value={amount.toLocaleString()}
            onChange={handleAmountChange}
            className={styles.amountInput}
          />
          <span className={styles.wonText}>원</span>
        </div>
      </div>

      <div className={styles.amountButtons}>
        {AMOUNT_BUTTONS.map((buttonAmount) => (
          <button
            key={buttonAmount}
            className={styles.amountButton}
            onClick={() => handleAmountIncrease(buttonAmount)}
          >
            +{buttonAmount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
