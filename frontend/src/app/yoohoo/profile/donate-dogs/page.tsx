'use client';

import DogCard from '@/components/common/Card/DogCard/DogCard';
import styles from './page.module.scss';
import { Dog, Gender, DogStatus } from '@/types/dog';

// 더미 데이터 생성
const dummyDogs: Dog[] = [
  {
    dogId: 1,
    name: '봄이',
    age: 2,
    gender: Gender.MALE,
    status: DogStatus.PROTECTED,
    imageUrl: '/images/dummy.jpeg',
  },
  {
    dogId: 2,
    name: '봄이',
    age: 2,
    gender: Gender.FEMALE,
    status: DogStatus.PROTECTED,
    imageUrl: '/images/dummy.jpeg',
  },
  {
    dogId: 3,
    name: '봄이',
    age: 2,
    gender: Gender.MALE,
    status: DogStatus.PROTECTED,
    imageUrl: '/images/dummy.jpeg',
  },
  {
    dogId: 4,
    name: '봄이',
    age: 2,
    gender: Gender.FEMALE,
    status: DogStatus.PROTECTED,
    imageUrl: '/images/dummy.jpeg',
  },
  {
    dogId: 5,
    name: '봄이',
    age: 2,
    gender: Gender.MALE,
    status: DogStatus.PROTECTED,
    imageUrl: '/images/dummy.jpeg',
  },
  {
    dogId: 6,
    name: '봄이',
    age: 2,
    gender: Gender.FEMALE,
    status: DogStatus.PROTECTED,
    imageUrl: '/images/dummy.jpeg',
  },
];

export default function MyDonateDogPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내가 후원한 강아지</h1>

      <div className={styles.dogGrid}>
        {dummyDogs.map((dog) => (
          <div key={dog.dogId} className={styles.dogCardWrapper}>
            <DogCard dog={dog} disableRouting={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
