import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'text'],
      description: '버튼 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '너비 100% 적용 여부',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: '로딩 상태 표시 여부',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '버튼 비활성화 여부',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 기본 버튼
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '후원하기',
  },
};

// 세컨더리 버튼
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '더 알아보기',
  },
};

// 아웃라인 버튼
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '취소',
  },
};

// 텍스트 버튼
export const Text: Story = {
  args: {
    variant: 'text',
    children: '자세히 보기',
  },
};

// 크기 변형
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size='sm'>작은 버튼</Button>
      <Button size='md'>중간 버튼</Button>
      <Button size='lg'>큰 버튼</Button>
    </div>
  ),
};

// 로딩 상태
export const Loading: Story = {
  args: {
    children: '로딩 중...',
    isLoading: true,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    children: '비활성화 버튼',
    disabled: true,
  },
};

// 전체 너비
export const FullWidth: Story = {
  args: {
    children: '전체 너비 버튼',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// 아이콘 포함
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button leftIcon={<span>👈</span>}>왼쪽 아이콘</Button>
      <Button rightIcon={<span>👉</span>}>오른쪽 아이콘</Button>
      <Button leftIcon={<span>🐶</span>} rightIcon={<span>❤️</span>}>
        양쪽 아이콘
      </Button>
    </div>
  ),
};
