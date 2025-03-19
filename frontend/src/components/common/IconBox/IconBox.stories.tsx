import type { Meta, StoryObj } from '@storybook/react';
import Icon, { IconName } from './IconBox';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'arrow-right',
        'arrow-left',
        'close',
        'check',
        'user',
        'settings',
        // 아이콘 이름 목록을 여기에 추가하세요
      ],
    },
    size: {
      control: { type: 'range', min: 12, max: 64, step: 4 },
    },
    color: {
      control: 'color',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'iconArrow',
    size: 24,
    color: '#000000',
  },
};

export const AllIcons: Story = {
  render: () => {
    const allIcons: IconName[] = [
        'iconArrow',
        'iconBell',
        'iconBone',
        'iconCalendar',
        'iconCart',
        'iconChevron',
        'iconDog',
        'iconDoghead',
        'iconDownload',
        'iconHeart',
        'iconHome',
        'iconPetfoot',
        'iconShare',
    ];
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
        {allIcons.map((iconName) => (
          <div key={iconName} style={{ textAlign: 'center' }}>
            <Icon name={iconName} size={32} />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>{iconName}</div>
          </div>
        ))}
      </div>
    );
  },
};

export const Colored: Story = {
  args: {
    name: 'iconBell',
    size: 32,
    color: '#4CAF50',
  },
};

export const Interactive: Story = {
  args: {
    name: 'iconBone',
    size: 32,
    color: '#2196F3',
    onClick: () => alert('아이콘이 클릭되었습니다!'),
  },
};
