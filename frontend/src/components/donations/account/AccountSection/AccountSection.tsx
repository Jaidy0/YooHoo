'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AccountSection.module.scss';
import StepTitle from '@/components/donations/StepTitle/StepTitle';
import AccountInfoCard from '../AccountInfoCard/AccountInfoCard';
import AccountNameRadio from '../AccountNameRadio/AccountNameRadio';
import MessageInput from '../MessageInput/MessageInput';
import { DonationFormData } from '@/types/donation';
import { useAccounts } from '@/hooks/donations/useAccount';
import { useShelterAccount } from '@/hooks/donations/useShelterAccount';
import { IconBox } from '@/components/common/IconBox/IconBox';
import { useAuthStore } from '@/store/authStore';

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
  const nickname = useAuthStore((state) => state.user?.nickname || '후원자');
  const [accountName, setAccountName] = useState(formData.accountName || '');
  const [selectedAccountIdx, setSelectedAccountIdx] = useState<number | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 계좌번호 포맷팅 함수
  const formatAccountNumber = (accountNo: string) => {
    if (!accountNo) return '';

    if (accountNo.length > 8) {
      return `${accountNo.slice(0, 4)}-${accountNo.slice(4, 8)}-${accountNo.slice(8)}`;
    }
    return accountNo;
  };

  // 계좌 선택 핸들러
  const handleAccountSelect = (index: number) => {
    setSelectedAccountIdx(index);
    setIsDropdownOpen(false);
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

  // 금액 포맷팅 함수 (1000 -> 1,000원)
  const formatBalance = (balance: string) => {
    return Number(balance).toLocaleString() + '원';
  };

  useEffect(() => {
    validateForm();
  }, [formData.accountNumber, accountName]);

  // 폼 유효성 검사 및 완료 상태 업데이트
  const validateForm = () => {
    const isValid = !!formData.accountNumber && !!accountName.trim();
    completeStep('accountInfo', isValid);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.accountSection}>
      <StepTitle number={stepNumber} title='입출금 계좌 및 정보 입력' />

      <div className={styles.accountInfoContainer}>
        {/* 출금 계좌 선택 (드롭다운) */}
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
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <div
                className={styles.dropdownHeader}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={styles.selectedAccountBox}>
                  {selectedAccountIdx !== null ? (
                    <div className={styles.selectedAccountContent}>
                      <div className={styles.iconWrapper}>
                        <IconBox name='account' size={24} />
                      </div>
                      <div className={styles.accountDetails}>
                        <p className={styles.bankName}>
                          {accounts[selectedAccountIdx].bankName}
                        </p>
                        <p className={styles.accountNumber}>
                          {formatAccountNumber(
                            accounts[selectedAccountIdx].accountNo
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className={styles.placeholder}>
                      계좌를 선택해주세요
                    </span>
                  )}
                </div>

                <div
                  className={`${styles.chevronIcon} ${isDropdownOpen ? styles.rotated : ''}`}
                >
                  <IconBox name='chevron' size={16} />
                </div>
              </div>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {accounts.map((account, index) => (
                    <div
                      key={account.accountNo}
                      className={`${styles.dropdownItem} ${selectedAccountIdx === index ? styles.selected : ''}`}
                      onClick={() => handleAccountSelect(index)}
                    >
                      <div className={styles.dropdownItemContent}>
                        <div className={styles.iconWrapper}>
                          <IconBox name='account' size={20} />
                        </div>
                        <div className={styles.accountDetails}>
                          <p className={styles.bankName}>{account.bankName}</p>
                          <p className={styles.accountNumber}>
                            {formatAccountNumber(account.accountNo)}
                          </p>
                        </div>
                        {selectedAccountIdx === index && (
                          <div className={styles.checkIcon}>
                            {/* <IconBox name='check' size={16} color="#4CAF50" /> */}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 선택된 계좌의 잔액 표시 */}
              {selectedAccountIdx !== null && !isDropdownOpen && (
                <div className={styles.selectedAccountBalance}>
                  잔액:{' '}
                  {formatBalance(accounts[selectedAccountIdx].accountBalance)}
                </div>
              )}
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
          nickname={nickname}
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
