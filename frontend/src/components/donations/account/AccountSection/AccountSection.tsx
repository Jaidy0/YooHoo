'use client';

import { useState } from 'react';
import styles from './AccountSection.module.scss';
import StepTitle from '@/components/donations/StepTitle/StepTitle';
import AccountInfoCard from '../AccountInfoCard/AccountInfoCard';
import AccountNameRadio from '../AccountNameRadio/AccountNameRadio';
import MessageInput from '../MessageInput/MessageInput';
import { DonationFormData } from '@/types/donation';
import { useAccounts } from '@/hooks/donations/useAccount';
import { useShelterAccount } from '@/hooks/donations/useShelterAccount';

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
  const [selectedAccountIdx, setSelectedAccountIdx] = useState<number | null>(
    null
  );

  // 내 계좌 정보 가져오기
  const {
    accounts,
    isLoading: isLoadingMyAccounts,
    error: myAccountsError,
  } = useAccounts();

  // 단체 계좌 정보 가져오기
  const {
    accountInfo: shelterAccount,
    isLoading: isLoadingShelterAccount,
    error: shelterAccountError,
  } = useShelterAccount(formData.shelterId);

  // 계좌 선택 핸들러
  const handleAccountSelect = (index: number) => {
    setSelectedAccountIdx(index);
    if (accounts[index]) {
      updateFormData({
        accountNumber: accounts[index].accountNo,
      });
    }
    validateForm();
  };

  // 입금자명 변경 핸들러
  const handleAccountNameChange = (value: string) => {
    setAccountName(value);
    updateFormData({ accountName: value });
    validateForm();
  };

  // 폼 유효성 검사 및 완료 상태 업데이트
  const validateForm = () => {
    const isValid = !!accountName && selectedAccountIdx !== null;
    completeStep('accountInfo', isValid);
  };

  return (
    <div className={styles.accountSection}>
      <StepTitle number={stepNumber} title='입출금 계좌 및 정보 입력' />

      <div className={styles.accountInfoContainer}>
        {/* 출금 계좌 선택 */}
        <div className={styles.accountSelection}>
          <h3>출금 계좌 선택</h3>
          {isLoadingMyAccounts ? (
            <div className={styles.loading}>
              계좌 정보를 불러오는 중입니다...
            </div>
          ) : myAccountsError ? (
            <div className={styles.error}>{myAccountsError}</div>
          ) : accounts.length === 0 ? (
            <div className={styles.noAccounts}>등록된 계좌가 없습니다.</div>
          ) : (
            <div className={styles.accountsList}>
              {accounts.map((account, index) => (
                <div
                  key={account.accountNo}
                  className={`${styles.accountCard} ${selectedAccountIdx === index ? styles.selected : ''}`}
                  onClick={() => handleAccountSelect(index)}
                >
                  <AccountInfoCard
                    bankName={account.bankName}
                    accountNumber={account.accountNo}
                    isSelected={selectedAccountIdx === index}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 입금 계좌 정보 (단체 계좌) */}
        <div className={styles.shelterAccountInfo}>
          <h3>입금 계좌 (단체)</h3>
          {isLoadingShelterAccount ? (
            <div className={styles.loading}>
              단체 계좌 정보를 불러오는 중입니다...
            </div>
          ) : shelterAccountError ? (
            <div className={styles.error}>{shelterAccountError}</div>
          ) : !shelterAccount ? (
            <div className={styles.noShelterAccount}>
              단체 계좌 정보가 없습니다.
            </div>
          ) : (
            <AccountInfoCard
              bankName={shelterAccount.bankName}
              accountNumber={shelterAccount.accountNo}
            />
          )}
        </div>
      </div>

      <div className={styles.accountNameContainer}>
        <h3>입금자명 설정</h3>
        <AccountNameRadio
          value={accountName}
          onChange={handleAccountNameChange}
          nickname='닉네임' // 추후 불러올 데이터
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
