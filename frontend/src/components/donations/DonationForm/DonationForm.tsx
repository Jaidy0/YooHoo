'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import styles from './DonationForm.module.scss';
import ProgressBar from '../ProgressBar/ProgressBar';
import ShelterSection from '../shelter/ShelterSection/ShelterSection';
import SelectSection, {
  DonationType,
  TargetType,
} from '../donationType/SelectSection/SelectSection';
import DogSection from '../donationType/DogSection/DogSection';
import PaymentDateSection from '../donationType/PaymentDateSection/PaymentDateSection';
import AccountSection from '../account/AccountSection/AccountSection';
import AmountSection from '../AmountSection/AmountSection';
import Button from '@/components/common/buttons/Button/Button';

import { DonationFormData } from '@/types/donation';
import { useDonationSubmit } from '@/hooks/donations/useDonationSubmit';
import { useShelterAccount } from '@/hooks/donations/useShelterAccount';
import { useShelterData } from '@/hooks/useShetlerData';
import { useDog } from '@/hooks/useDog';

type DonationFormProps = {
  initialShelterId?: number;
  initialDogId?: number;
};

export default function DonationForm({
  initialShelterId,
  initialDogId,
}: DonationFormProps) {
  const router = useRouter();
  const { submitDonation, isLoading, error, isSuccess } = useDonationSubmit();

  // 강아지 ID가 있으면 일시후원 및 강아지 후원으로 기본값 설정
  const initialDonationType: DonationType = initialDogId ? 1 : 1; // 강아지 ID가 있으면 일시후원(1)
  const initialTargetType: TargetType = initialDogId ? 'dog' : 'shelter'; // 강아지 ID가 있으면 강아지 후원

  // 단체 정보 가져오기
  const { shelter, isLoading: isShelterLoading } = initialShelterId
    ? useShelterData(initialShelterId)
    : { shelter: null, isLoading: false };

  // 강아지 정보 가져오기
  const { dog, isLoading: isDogLoading } = initialDogId
    ? useDog(initialDogId)
    : { dog: null, isLoading: false };

  // 폼 데이터 상태
  const [formData, setFormData] = useState<DonationFormData>({
    shelterId: initialShelterId ?? 0,
    shelterName: '',
    shelterAccountNumber: '',
    donationType: initialDonationType, // 강아지 ID가 있으면 일시후원으로 설정
    paymentDay: 0,
    targetType: initialTargetType, // 강아지 ID가 있으면 강아지 후원으로 설정
    dogId: initialDogId ?? 0,
    dogName: '',
    accountName: '',
    accountNumber: '',
    supportMessage: '',
    anonymousDonation: false,
    amount: 0,
    isRecent: false,
  });

  // 단체 계좌 정보 가져오기
  const { accountInfo: shelterAccount } = useShelterAccount(formData.shelterId);

  // 단체 계좌 정보가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (shelterAccount && shelterAccount.accountNo) {
      updateFormData({
        shelterAccountNumber: shelterAccount.accountNo,
      });
    }
  }, [shelterAccount]);

  // 단체 정보가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (shelter) {
      updateFormData({
        shelterName: shelter.name || '',
      });
    }
  }, [shelter]);

  // 강아지 정보가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (dog) {
      updateFormData({
        dogName: dog.name || '',
      });
    }
  }, [dog]);

  // 각 단계 완료 상태
  const [stepsCompleted, setStepsCompleted] = useState({
    shelter: !!initialShelterId,
    donationType: true, // 항상 선택되어 있음 (기본값이 있기 때문)
    paymentDetails: true,
    targetSelection: true, // 항상 선택되어 있음 (기본값이 있기 때문)
    dogSelection: !!initialDogId, // 강아지 ID가 있으면 이미 선택된 것으로 간주
    accountInfo: false,
    amount: false,
  });

  // 단계 완료 상태 업데이트 함수
  const completeStep = (
    step: keyof typeof stepsCompleted,
    isCompleted: boolean = true
  ) => {
    setStepsCompleted((prev) => ({
      ...prev,
      [step]: isCompleted,
    }));
  };

  // 프로그레스 계산
  const calculateProgress = (): number => {
    const requiredSteps = [
      stepsCompleted.shelter, // 필수
      stepsCompleted.donationType, // 필수
    ];

    // 후원 유형에 따라 필요한 단계 추가
    if (formData.donationType === 0) {
      requiredSteps.push(stepsCompleted.paymentDetails); // 정기후원은 결제일 필수
    } else if (formData.targetType === 'dog') {
      requiredSteps.push(stepsCompleted.dogSelection); // 강아지 후원은 강아지 선택 필수
    }

    // 계좌 정보와 금액 입력
    requiredSteps.push(stepsCompleted.accountInfo, stepsCompleted.amount);

    // 완료된 단계 수 / 총 필요 단계 수
    const completedCount = requiredSteps.filter(Boolean).length;
    return (completedCount / requiredSteps.length) * 100;
  };

  // 후원하기 버튼 클릭 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (calculateProgress() !== 100) {
      return; // 모든 단계가 완료되지 않으면 제출하지 않음
    }

    await submitDonation(formData);
    // 성공 페이지로 이동은 useEffect에서 처리
  };

  // 후원 성공 시 완료 페이지로 이동
  useEffect(() => {
    if (isSuccess) {
      router.push('/yoohoo/donate/complete');
    }
  }, [isSuccess, router]);

  // 폼 데이터 업데이트 함수
  const updateFormData = (data: Partial<DonationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // 단체 선택 핸들러
  const handleSelectShelter = (id: number, name: string) => {
    updateFormData({ shelterId: id, shelterName: name });
    completeStep('shelter');
  };

  return (
    <>
      <div className={styles.progressBarContainer}>
        <ProgressBar progress={calculateProgress()} />
      </div>
      <div className={styles.donationForm}>
        {/* 1. 단체 선택 */}
        <section>
          <ShelterSection
            selectedShelterId={formData.shelterId}
            onSelectShelter={handleSelectShelter}
          />
        </section>

        {/* 2. 후원 방식 선택 */}
        <section>
          <SelectSection
            step='donationType'
            stepNumber={2}
            selectedValue={formData.donationType}
            onSelect={(value) => {
              updateFormData({ donationType: value as DonationType });
              completeStep('donationType');

              // 정기후원 선택 시 관련 단계 초기화
              if (value === 0) {
                completeStep('paymentDetails', false);
              } else {
                // 일시후원 선택 시 타겟 타입 초기화
                // 강아지 ID가 있으면 강아지 후원 유지, 그렇지 않으면 기본값으로 설정
                updateFormData({
                  targetType: initialDogId ? 'dog' : 'shelter',
                });
                completeStep('targetSelection', true);
                completeStep('dogSelection', !!initialDogId);
              }
            }}
          />
        </section>

        {/* 3A. 정기후원-정기 결제일 선택 */}
        {formData.donationType === 0 && (
          <section>
            <PaymentDateSection
              stepNumber={3}
              selectedDay={formData.paymentDay}
              onSelectDay={(day) => {
                updateFormData({ paymentDay: day });
                completeStep('paymentDetails', day > 0);
              }}
            />
          </section>
        )}

        {/* 3B. 일시후원-후원 대상 선택 */}
        {formData.donationType === 1 && (
          <section>
            <SelectSection
              step='targetType'
              stepNumber={3}
              selectedValue={formData.targetType}
              onSelect={(value) => {
                updateFormData({ targetType: value as TargetType });
                completeStep('targetSelection');

                // 강아지 선택 시 강아지 선택 단계 초기화
                if (value === 'dog') {
                  completeStep('dogSelection', !!initialDogId);
                } else {
                  // 단체 선택 시 강아지 선택 단계는 이미 완료된 것으로 간주
                  completeStep('dogSelection', true);
                }
              }}
            />
          </section>
        )}

        {/* 3C. 일시후원-강아지 선택 */}
        {formData.donationType === 1 && formData.targetType === 'dog' && (
          <section>
            <DogSection
              shelterId={formData.shelterId}
              selectedDogId={formData.dogId}
              onSelectDog={(id, name) => {
                updateFormData({ dogId: id, dogName: name });
                completeStep('dogSelection');
              }}
              stepNumber={4}
            />
          </section>
        )}

        {/* 4. 계좌 정보 및 응원 메시지 */}
        <section>
          <AccountSection
            stepNumber={4}
            formData={formData}
            updateFormData={updateFormData}
            completeStep={completeStep}
            donationType={formData.donationType}
          />
        </section>

        {/* 5. 후원 금액 입력 */}
        <section>
          <AmountSection
            stepNumber={5}
            currentAmount={formData.amount}
            updateFormData={updateFormData}
            completeStep={completeStep}
          />
        </section>

        {/* 후원 요약 및 완료 버튼 */}
        <div className={styles.donationSummary}>
          {!formData.shelterId ? (
            <p>후원할 단체를 선택해주세요.</p>
          ) : formData.donationType === 0 ? (
            !formData.paymentDay ? (
              <p>결제일을 선택해주세요.</p>
            ) : formData.amount <= 0 ? (
              <p>후원 금액을 입력해주세요.</p>
            ) : (
              <p>
                매월 {formData.paymentDay}일 {formData.amount.toLocaleString()}
                원을 후원합니다.
              </p>
            )
          ) : formData.targetType === 'dog' ? (
            !formData.dogName ? (
              <p>후원할 강아지를 선택해주세요.</p>
            ) : formData.amount <= 0 ? (
              <p>후원 금액을 입력해주세요.</p>
            ) : (
              <p>
                {formData.dogName}에게 {formData.amount.toLocaleString()}원을
                후원합니다.
              </p>
            )
          ) : formData.amount <= 0 ? (
            <p>후원 금액을 입력해주세요.</p>
          ) : (
            <p>
              {formData.shelterName}에 {formData.amount.toLocaleString()}원을
              후원합니다.
            </p>
          )}
        </div>

        {/* 에러 메시지 표시 */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.buttonContainer}>
          <Button
            onClick={handleSubmit}
            className={styles.submitButton}
            variant={
              calculateProgress() === 100
                ? isLoading
                  ? 'disabled'
                  : 'primary'
                : 'disabled'
            }
            disabled={calculateProgress() !== 100 || isLoading}
          >
            {isLoading ? '처리 중...' : '후원하기'}
          </Button>
        </div>
      </div>
    </>
  );
}
