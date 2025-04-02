import type { Meta, StoryObj } from '@storybook/react';
import ShelterCard from './ShelterCard';

const meta: Meta<typeof ShelterCard> = {
  title: 'Components/Shelters/ShelterCard',
  component: ShelterCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f7f7f7' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    imageUrl: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    dogCount: { control: 'number' },
    reliability: { control: 'number' },
    onClick: { action: 'clicked' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShelterCard>;

export const Default: Story = {
  args: {
    imageUrl: 'https://picsum.photos/800/450',
    title: '동물보호연합',
    description: '다함께 지켜가는 후원 행복\n모두의 힘으로 아이들을 지켜주세요',
    dogCount: 99,
    reliability: 99,
  },
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title: '아주 긴 제목의 동물보호연합 보호소입니다',
  },
};

export const LongDescription: Story = {
  args: {
    ...Default.args,
    description:
      '이것은 아주 긴 설명입니다. 여러 줄에 걸쳐 표시될 수 있으며, 실제 환경에서 어떻게 보일지 테스트해볼 수 있습니다. 말줄임표가 제대로 적용되는지 확인해보세요.',
  },
};

export const NoImage: Story = {
  args: {
    ...Default.args,
    imageUrl: '',
  },
};

export const ZeroCounts: Story = {
  args: {
    ...Default.args,
    dogCount: 0,
    reliability: 0,
  },
};

export const LargeCounts: Story = {
  args: {
    ...Default.args,
    dogCount: 999,
    reliability: 999,
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
  },
};
