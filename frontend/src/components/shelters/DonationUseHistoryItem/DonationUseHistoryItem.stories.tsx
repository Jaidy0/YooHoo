import type { Meta, StoryObj } from '@storybook/react';
import DonationUseHistoryItem from './DonationUseHistoryItem';

const meta: Meta<typeof DonationUseHistoryItem> = {
  title: 'Components/Shelters/DonationUseHistoryItem',
  component: DonationUseHistoryItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{ width: '360px', padding: '20px', backgroundColor: '#f5f5f5' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DonationUseHistoryItem>;

export const Expense: Story = {
  args: {
    date: '2025.03.04',
    amount: -320000,
    description: '강아지 사료 구매',
    isVerified: true,
  },
};

export const Income: Story = {
  args: {
    date: '2025.03.01',
    amount: 500000,
    description: '후원금 입금',
    isVerified: false,
  },
};

export const LongDescription: Story = {
  args: {
    date: '2025.03.04',
    amount: -150000,
    description: '강아지 사료 구매 및 배송비 결제 (10마리 기준)',
    isVerified: true,
  },
};

export const WithoutVerification: Story = {
  args: {
    date: '2025.03.04',
    amount: -320000,
    description: '강아지 사료 구매',
    isVerified: false,
  },
};
