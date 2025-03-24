import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import IconBox from '../../IconBox/IconBox';

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'outline', 'disabled'],
      description: '버튼 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
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
    children: '버튼',
  },
};

// 아웃라인 버튼
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '버튼',
  },
};

// 비활성 버튼
export const Disabled: Story = {
  args: {
    variant: 'disabled',
    children: '버튼',
  },
};

// 모든 버튼 스타일
export const AllStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant='primary'>버튼</Button>
      <Button variant='outline'>버튼</Button>
      <Button variant='disabled'>버튼</Button>
    </div>
  ),
};

// 크기 변형 - 프리셋 사이즈
export const SizePresets: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginRight: '24px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#777' }}>Small (sm)</span>
        <Button size='sm'>버튼</Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginRight: '24px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#777' }}>Medium (md)</span>
        <Button size='md'>버튼</Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#777' }}>Large (lg)</span>
        <Button size='lg'>버튼</Button>
      </div>
    </div>
  ),
};

// 사용자 지정 크기
export const CustomSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginRight: '24px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#777' }}>
          width: 200px, height: 50px
        </span>
        <Button width={200} height={50}>
          버튼
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginRight: '24px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#777' }}>
          width: 150px, height: 60px
        </span>
        <Button width={150} height={60} variant='outline'>
          버튼
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#777' }}>
          width: 120px, height: 40px
        </span>
        <Button width={120} height={40} variant='disabled'>
          버튼
        </Button>
      </div>
    </div>
  ),
};

// 아이콘 포함
export const WithIcons: Story = {
  render: () => {
    const PlusIcon = () => (
      <svg
        width='14'
        height='14'
        viewBox='0 0 14 14'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M7 0V14' stroke='currentColor' strokeWidth='2' />
        <path d='M14 7L0 7' stroke='currentColor' strokeWidth='2' />
      </svg>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button leftIcon={<PlusIcon />}>버튼</Button>
        <Button variant='outline' leftIcon={<PlusIcon />}>
          버튼
        </Button>
        <Button
          variant='disabled'
          rightIcon={<IconBox name='share' size={16} />}
        >
          버튼
        </Button>
      </div>
    );
  },
};
