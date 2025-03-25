'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from '../ProgressBar/ProgressBar';

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
    organization: initialShelterId ?? 0,
    organizationName: '',
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
    organization: !!initialShelterId,
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
      stepsCompleted.organization, // 필수
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <ProgressBar progress={calculateProgress()} />
      </div>

      {/* 1. 단체 선택 */}
      <section>{/* <ShelterSection/> */}</section>
    </form>
  );
}
