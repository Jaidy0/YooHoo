import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Common/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['positive', 'negative'],
      description: '뱃지 스타일 변형',
      table: {
        defaultValue: { summary: 'positive' },
      },
    },
    width: {
      control: 'text',
      description: '뱃지 너비 - 직접 지정 (px 또는 %)',
    },
    height: {
      control: 'text',
      description: '뱃지 높이 - 직접 지정 (px 또는 %)',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스명',
    },
    children: {
      control: 'text',
      description: '뱃지 내용',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// 기본 뱃지
export const Default: Story = {
  args: {
    children: '뱃지',
    variant: 'positive',
  },
};

// 긍정 뱃지
export const Positive: Story = {
  args: {
    children: '일시 후원',
    variant: 'positive',
    width: 80,
    height: 24,
  },
};

// 부정 뱃지
export const Negative: Story = {
  args: {
    children: '지정(간장)',
    variant: 'negative',
    width: 80,
    height: 24,
  },
};

// 다양한 크기
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge variant='positive' width={60} height={20}>
        작은 크기
      </Badge>
      <Badge variant='positive' width={80} height={24}>
        중간 크기
      </Badge>
      <Badge variant='positive' width={100} height={28}>
        큰 크기
      </Badge>
    </div>
  ),
};

// 다양한 변형
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge variant='positive' width={80} height={24}>
        긍정적
      </Badge>
      <Badge variant='negative' width={80} height={24}>
        부정적
      </Badge>
    </div>
  ),
};
