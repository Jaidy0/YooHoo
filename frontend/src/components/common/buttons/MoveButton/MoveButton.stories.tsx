import type { Meta, StoryObj } from '@storybook/react';
import MoveButton from './MoveButton';

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

// 아이콘이 있는 버튼들
export const WithIcons: Story = {
  render: () => {
    const HomeIcon = () => (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M9 22V12H15V22'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );

    const ArrowIcon = () => (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M5 12H19'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12 5L19 12L12 19'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );

    const AlertIcon = () => (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <MoveButton leftIcon={<HomeIcon />}>채널 바로가기</MoveButton>
        <MoveButton rightIcon={<AlertIcon />}>알림 보기</MoveButton>
        <MoveButton
          leftIcon={<HomeIcon />}
          rightIcon={<ArrowIcon />}
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
        leftIcon={
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9 22V12H15V22'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        }
      >
        홈으로 가기
      </MoveButton>

      <MoveButton
        variant='secondary'
        rightIcon={
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M5 12H19'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 5L19 12L12 19'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        }
      >
        다음으로
      </MoveButton>

      <MoveButton isLoading>로딩 중...</MoveButton>
      <MoveButton variant='secondary' isLoading>
        로딩 중...
      </MoveButton>
    </div>
  ),
};
