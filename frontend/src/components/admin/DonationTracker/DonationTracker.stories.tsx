import type { Meta, StoryObj } from '@storybook/react';
import DonationTracker from './DonationTracker';

// 메타데이터 정의
const meta: Meta<typeof DonationTracker> = {
  title: 'Components/Admin/DonationTracker',
  component: DonationTracker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['total', 'withdraw', 'deposit'],
      description: '트래커 유형 (총액, 출금, 입금)',
    },
    amount: {
      control: { type: 'number' },
      description: '금액',
    },
    compareDeposit: {
      control: { type: 'number' },
      description: '이전 달 대비 입금 비교 금액',
    },
    compareWithdraw: {
      control: { type: 'number' },
      description: '이전 달 대비 출금 비교 금액',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DonationTracker>;

// 기본 스토리
export const Total: Story = {
  args: {
    variant: 'total',
    amount: 1250000,
    compareDeposit: 50000,
    compareWithdraw: 30000,
  },
};

export const Deposit: Story = {
  args: {
    variant: 'deposit',
    amount: 750000,
  },
};

export const Withdraw: Story = {
  args: {
    variant: 'withdraw',
    amount: 500000,
  },
};

// 큰 금액 케이스
export const LargeAmount: Story = {
  args: {
    variant: 'total',
    amount: 123456789,
    compareDeposit: 1234567,
    compareWithdraw: 7654321,
  },
};

// 0원 케이스
export const ZeroAmount: Story = {
  args: {
    variant: 'deposit',
    amount: 0,
  },
};

// 통합 뷰
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <DonationTracker
        variant='total'
        amount={1250000}
        compareDeposit={50000}
        compareWithdraw={30000}
      />
      <DonationTracker variant='deposit' amount={750000} />
      <DonationTracker variant='withdraw' amount={500000} />
    </div>
  ),
};
