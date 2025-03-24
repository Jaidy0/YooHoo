// IconBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import IconBox from './IconBox';

// 메타데이터 정의
const meta: Meta<typeof IconBox> = {
  title: 'UI/IconBox',
  component: IconBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'arrow',
        'bell',
        'bone',
        'calendar',
        'cart',
        'chevron',
        'dog',
        'doghead',
        'download',
        'heart',
        'home',
        'petfoot',
        'share',
      ],
      description: '아이콘 이름',
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
      description: '아이콘 크기 (px)',
    },
    color: {
      control: 'color',
      description: '아이콘 색상',
    },
    className: {
      control: 'text',
      description: '추가 클래스명',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconBox>;

// 기본 아이콘 스토리
export const Default: Story = {
  args: {
    name: 'dog',
    size: 24,
  },
};

// 모든 아이콘 전시
export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='arrow' />
        <span>arrow</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='bell' />
        <span>bell</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='bone' />
        <span>bone</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='calendar' />
        <span>calendar</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='cart' />
        <span>cart</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='chevron' />
        <span>chevron</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='dog' />
        <span>dog</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='doghead' />
        <span>doghead</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='download' />
        <span>download</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='heart' />
        <span>heart</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='home' />
        <span>home</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='petfoot' />
        <span>petfoot</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconBox name='share' />
        <span>share</span>
      </div>
    </div>
  ),
};

// 다양한 크기의 아이콘
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <IconBox name='dog' size={16} />
      <IconBox name='dog' size={24} />
      <IconBox name='dog' size={32} />
      <IconBox name='dog' size={48} />
      <IconBox name='dog' size={64} />
    </div>
  ),
};

// 다양한 색상의 아이콘
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <IconBox name='heart' color='#FF0000' />
      <IconBox name='heart' color='#00FF00' />
      <IconBox name='heart' color='#0000FF' />
      <IconBox name='heart' color='#FF00FF' />
      <IconBox name='heart' color='#FFD700' />
    </div>
  ),
};

// 클릭 이벤트가 있는 아이콘
export const Clickable: Story = {
  args: {
    name: 'download',
    size: 32,
    onClick: () => alert('아이콘이 클릭되었습니다!'),
  },
};
