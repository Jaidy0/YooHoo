import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SelectCard from './SelectCard';
import { IconBox } from '../IconBox/IconBox';

const meta: Meta<typeof SelectCard> = {
  title: 'Components/Common/SelectCard',
  component: SelectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    borderType: {
      control: 'select',
      options: ['default', 'gray', 'none'],
    },
    isSelected: { control: 'boolean' },
    noBorderOnSelect: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof SelectCard>;

export const DefaultCard: Story = {
  args: {
    title: '일시 후원',
    description: '한 번만 후원합니다',
    icon: <IconBox name='heart' size={28} />,
    borderType: 'default',
    isSelected: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '165px' }}>
        <Story />
      </div>
    ),
  ],
};

export const SelectedCard: Story = {
  args: {
    ...DefaultCard.args,
    isSelected: true,
    noBorderOnSelect: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '165px' }}>
        <Story />
      </div>
    ),
  ],
};

export const GrayBorderCard: Story = {
  args: {
    ...DefaultCard.args,
    borderType: 'gray',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '165px' }}>
        <Story />
      </div>
    ),
  ],
};

export const CardWithoutDescription: Story = {
  args: {
    title: '보호 중',
    borderType: 'default',
    isSelected: false,
  },
};

export const CardVariations: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ width: '165px' }}>
        <SelectCard
          {...args}
          title='정기 후원'
          description='매월 자동으로 후원합니다'
          icon={<IconBox name='calendar' size={24} color="#999999"/>}
          borderType='gray'
          isSelected={false}
        />
      </div>
      <div style={{ width: '165px' }}>
        <SelectCard
          {...args}
          title='일시 후원'
          description='한 번만 후원합니다'
          icon={<IconBox name='heart' size={24} color="#ff544c"/>}
          borderType='none'
          isSelected={true}
        />
      </div>
      <div style={{ width: '165px' }}>
        <SelectCard
          {...args}
          title='단체 후원'
          description='단체 전체를 후원합니다'
          icon={<IconBox name='doghead' size={24} color="#ff544c"/>}
          borderType='none'
          isSelected={true}
        />
      </div>
      <div style={{ width: '165px' }}>
        <SelectCard
          {...args}
          title='강아지 후원'
          description='특정 강아지를 후원합니다'
          icon={<IconBox name='dog' size={24} color="#999999"/>}
          borderType='gray'
          isSelected={false}
        />
      </div>
    </div>
  ),
};
