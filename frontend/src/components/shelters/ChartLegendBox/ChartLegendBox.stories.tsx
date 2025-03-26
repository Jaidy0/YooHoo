import type { Meta, StoryObj } from '@storybook/react';
import ChartLegendBox from './ChartLegendBox';

const meta: Meta<typeof ChartLegendBox> = {
  title: 'Components/Shelters/ChartLegendBox',
  component: ChartLegendBox,
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
type Story = StoryObj<typeof ChartLegendBox>;

export const ThreeColumns: Story = {
  args: {
    items: [
      { label: '인건비', color: '#7A91E0' },
      { label: '사료비', color: '#1BB9B3' },
      { label: '의료비', color: '#F4B616' },
      { label: '운영비', color: '#EE417C' },
      { label: '기타비용', color: '#F2B2D1' },
      { label: '후원금', color: '#F57C17' },
      { label: '전체 평균', color: '#fff' },
    ],
    itemsPerRow: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    items: [
      { label: '수입', color: '#7A91E0' },
      { label: '지출', color: '#F4B616' },
    ],
    itemsPerRow: 2,
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: '인건비/운영비', color: '#7A91E0' },
      { label: '사료/간식비', color: '#1BB9B3' },
      { label: '의료/치료비', color: '#F4B616' },
    ],
    itemsPerRow: 3,
  },
};

export const SixItems: Story = {
  args: {
    items: [
      { label: '인건비', color: '#7A91E0' },
      { label: '사료비', color: '#1BB9B3' },
      { label: '의료비', color: '#F4B616' },
      { label: '운영비', color: '#EE417C' },
      { label: '기타비용', color: '#F2B2D1' },
      { label: '후원금', color: '#F57C17' },
      { label: '전체단체의 평균 비율', color: '#fff' },
    ],
    itemsPerRow: 3,
  },
};
