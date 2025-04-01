import type { Meta, StoryObj } from '@storybook/react';
import DogCard from './DogCard';
import { DogStatus, Gender } from '@/types/dog';

const meta: Meta<typeof DogCard> = {
  title: 'Dogs/DogCard',
  component: DogCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof DogCard>;

export const Default: Story = {
  args: {
    dog: {
      dogId: 1,
      name: '흰둥이',
      age: 3,
      gender: Gender.MALE,
      status: DogStatus.PROTECTED,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
  },
};

export const Female: Story = {
  args: {
    dog: {
      dogId: 2,
      name: '별이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
  },
};

export const Temporary: Story = {
  args: {
    dog: {
      dogId: 3,
      name: '토비',
      age: 5,
      gender: Gender.MALE,
      status: DogStatus.TEMPORARY,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
  },
};

export const Adopted: Story = {
  args: {
    dog: {
      dogId: 4,
      name: '초코',
      age: 1,
      gender: Gender.FEMALE,
      status: DogStatus.ADOPTED,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
  },
};

export const NoImage: Story = {
  args: {
    dog: {
      dogId: 5,
      name: '마루',
      age: 6,
      gender: Gender.MALE,
      status: DogStatus.PROTECTED,
      // 이미지 없음 - 기본 이미지 표시
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
  },
};
