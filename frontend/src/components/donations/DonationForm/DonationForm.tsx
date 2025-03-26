'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from '../ProgressBar/ProgressBar';
import ShelterSection from '../shelter/ShelterSection/ShelterSection';
import SelectSection, {
  DonationType,
  TargetType,
} from '../donationType/SelectSection/SelectSection';

import { DonationFormData } from '@/types/donation';

type DonationFormProps = {
  initialShelterId?: number;
  initialDogId?: number;
};

export default function DonationForm({
  initialShelterId,
  initialDogId,
}: DonationFormProps) {
  //   const router = useRouter();
  //   const { mutate: submitDonation} = useDonationSubmit();

  // 폼 데이터 상태
  const [formData, setFormData] = useState<DonationFormData>({
    shelterId: initialShelterId ?? 0,
    shelterName: '',
    donationType: 0, // 0: 정기후원 기본값
    paymentDay: 15,
    targetType: 'shelter', // 단체후원 기본값
    dogId: initialDogId ?? 0,
    dogName: '',
    accountName: '',
    accountNumber: '',
    supportMessage: '',
    anonymousDonation: false,
    amount: 0,
  });

  // 각 단계 완료 상태
  const [stepsCompleted, setStepsCompleted] = useState({
    shelter: !!initialShelterId,
    donationType: true,
    paymentDetails: false,
    targetSelection: true,
    dogSelection: !!initialDogId,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submitDonation(FormData, {});
    // router.push('/donate/complete');
  };

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
    <div onSubmit={handleSubmit}>
      <div>
        <ProgressBar progress={calculateProgress()} />
      </div>

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
              updateFormData({ targetType: 'shelter' });
              completeStep('targetSelection', true);
              completeStep('dogSelection', false);
            }
          }}
        />
      </section>

      {/* 3. 일시 후원 시 후원 대상 선택 섹션 */}
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
                completeStep('dogSelection', false);
              }
            }}
          />
        </section>
      )}
    </div>
  );
}
