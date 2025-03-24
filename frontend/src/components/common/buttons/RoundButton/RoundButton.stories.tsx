import type { Meta, StoryObj } from '@storybook/react';
import RoundButton from './RoundButton';

const meta: Meta<typeof RoundButton> = {
  title: 'Components/Common/Buttons/RoundButton',
  component: RoundButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['fill', 'primary', 'secondary'],
      description: '버튼 디자인 변형',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof RoundButton>;

// 검은색 테두리 버튼
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '로그인',
  },
};

// 회색 테두리 버튼
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '추가하기',
  },
};

// 채워진 버튼 (검은색 배경에 흰색 글자)
export const Fill: Story = {
  args: {
    variant: 'fill',
    children: '로그인',
  },
};

// 비활성화 상태 버튼
export const Disabled: Story = {
  args: {
    variant: 'disabled',
    children: '로그인',
  },
};

// 모든 버튼 스타일
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <RoundButton variant='primary'>로그인</RoundButton>
      <RoundButton variant='secondary'>추가하기</RoundButton>
      <RoundButton variant='fill'>로그인</RoundButton>
      <RoundButton variant='disabled'>로그인</RoundButton>
    </div>
  ),
};
