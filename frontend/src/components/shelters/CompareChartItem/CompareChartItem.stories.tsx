import type { Meta, StoryObj } from '@storybook/react';
import CompareChartItem from './CompareChartItem';

const meta: Meta<typeof CompareChartItem> = {
  title: 'Components/Shelters/CompareChartItem',
  component: CompareChartItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label1: { control: 'text' },
    label2: { control: 'text' },
    value1: {
      control: { type: 'range', min: 0, max: 100 },
    },
    value2: {
      control: { type: 'range', min: 0, max: 100 },
    },
    height: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CompareChartItem>;

export const Default: Story = {
  args: {
    label1: '인건비',
    label2: '평균',
    value1: 30,
    value2: 30,
  },
};

export const DifferentValues: Story = {
  args: {
    label1: '인건비',
    label2: '평균',
    value1: 45,
    value2: 30,
  },
};

export const CustomHeight: Story = {
  args: {
    label1: '인건비',
    label2: '평균',
    value1: 30,
    value2: 30,
    height: 48,
  },
};
