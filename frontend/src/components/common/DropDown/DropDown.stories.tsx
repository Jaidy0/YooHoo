import type { Meta, StoryObj } from '@storybook/react';
import DropDown from './DropDown';

const meta: Meta<typeof DropDown> = {
  title: 'Components/Common/DropDown',
  component: DropDown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '드롭다운에 표시될 기본 텍스트',
    },
    options: {
      control: 'object',
      description: '드롭다운 옵션 목록',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof DropDown>;

// 기본 드롭다운
export const Default: Story = {
  args: {
    placeholder: '선택',
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
  },
};

// 기본값이 선택된 드롭다운
export const WithSelectedValue: Story = {
  args: {
    placeholder: '선택',
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    value: 'option2',
  },
};

// 정렬 옵션 드롭다운
export const FilterDropDown: Story = {
  args: {
    placeholder: '정렬',
    options: [
      { value: 'dogCount', label: '강아지 수' },
      { value: 'trustIndex', label: '믿음지수' },
    ],
  },
};
