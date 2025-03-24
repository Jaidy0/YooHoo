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
      mainImage: {
        imageId: 1,
        dogId: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
        isMain: true,
        uploadDate: '2024-02-16T15:00:00.000+00:00',
      },
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
      mainImage: {
        imageId: 2,
        dogId: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1534361960057-19889db9621e',
        isMain: true,
        uploadDate: '2024-02-16T15:00:00.000+00:00',
      },
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
      mainImage: {
        imageId: 3,
        dogId: 3,
        imageUrl:
          'https://images.unsplash.com/photo-1583511655826-05700442b31b',
        isMain: true,
        uploadDate: '2024-02-16T15:00:00.000+00:00',
      },
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
      mainImage: {
        imageId: 4,
        dogId: 4,
        imageUrl:
          'https://images.unsplash.com/photo-1593134257782-e89567b7718a',
        isMain: true,
        uploadDate: '2024-02-16T15:00:00.000+00:00',
      },
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
    },
  },
};
