import type { Meta, StoryObj } from '@storybook/react';
import MoveButton from './MoveButton';
import IconBox from '../../IconBox/IconBox';

const meta: Meta<typeof MoveButton> = {
  title: 'Components/Common/Buttons/MoveButton',
  component: MoveButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: '버튼 디자인 변형 (색상)',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: '로딩 상태 표시 여부',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof MoveButton>;

// 기본 버튼
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '이동하기',
  },
};

// 색 반전 버튼
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '이동하기',
  },
};

// 노란색 버튼
export const Yellow: Story = {
  args: {
    variant: 'yellow',
    children: '이동하기',
  },
};
// 아이콘이 있는 버튼들
export const WithIcons: Story = {
  render: () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <MoveButton leftIcon={<IconBox name='home' size={16} />}>
          채널 바로가기
        </MoveButton>
        <MoveButton leftIcon={<IconBox name='bell' size={16} />}>
          알림 보기
        </MoveButton>
        <MoveButton
          leftIcon={<IconBox name='home' size={16} />}
          rightIcon={<IconBox name='chevron' size={20} />}
          variant='secondary'
        >
          바로가기
        </MoveButton>
      </div>
    );
  },
};

// 모든 변형 모아보기
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        padding: '16px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          color: '#777',
          marginBottom: '8px',
          gridColumn: '1 / span 1',
        }}
      >
        기본
      </div>
      <div
        style={{
          textAlign: 'center',
          color: '#777',
          marginBottom: '8px',
          gridColumn: '2 / span 1',
        }}
      >
        색상 반전
      </div>

      <MoveButton variant='primary'>바로가기</MoveButton>
      <MoveButton variant='secondary'>바로가기</MoveButton>

      <MoveButton
        variant='primary'
        leftIcon={<IconBox name='home' size={16} />}
      >
        홈으로 가기
      </MoveButton>

      <MoveButton
        variant='secondary'
        rightIcon={<IconBox name='chevron' size={20} />}
      >
        다음으로
      </MoveButton>
    </div>
  ),
};
