'use client';

import { useState } from 'react';
import styles from './AccountSection.module.scss';
import StepTitle from '@/components/donations/StepTitle/StepTitle';
import AccountInfoCard from '../AccountInfoCard/AccountInfoCard';
import AccountNameRadio from '../AccountNameRadio/AccountNameRadio';
import MessageInput from '../MessageInput/MessageInput';
import { DonationFormData } from '@/types/donation';

type AccountSectionProps = {
  stepNumber: number;
  formData: DonationFormData;
  updateFormData: (data: Partial<DonationFormData>) => void;
  completeStep: (step: 'accountInfo', isCompleted?: boolean) => void;
  donationType: number;
};

export default function AccountSection({
  stepNumber,
  formData,
  updateFormData,
  completeStep,
  donationType,
}: AccountSectionProps) {
  const [accountName, setAccountName] = useState(formData.accountName || '');

  const handleAccountNameChange = (value: string) => {
    setAccountName(value);
    updateFormData({ accountName: value });
    completeStep('accountInfo', !!value);
  };

  return (
    <div className={styles.accountSection}>
      <StepTitle number={stepNumber} title='입출금 계좌 및 정보 입력' />

      <div className={styles.accountInfoContainer}>
        {/* 더미 데이터 */}
        <AccountInfoCard
          title='출금 계좌'
          bankName='싸피은행'
          accountNumber='110-123-456789'
        />
        <AccountInfoCard
          title='입금 계좌'
          bankName='반디은행'
          accountNumber='110-123-456789'
        />
      </div>

      <div className={styles.accountNameContainer}>
        <h3>입금자명 설정</h3>
        <AccountNameRadio
          value={accountName}
          onChange={handleAccountNameChange}
        />
      </div>

      {donationType === 1 && (
        <div className={styles.supportMessageContainer}>
          <MessageInput
            value={formData.supportMessage}
            onChange={(msg) => updateFormData({ supportMessage: msg })}
            targetType={formData.targetType}
          />
        </div>
      )}
    </div>
  );
}
