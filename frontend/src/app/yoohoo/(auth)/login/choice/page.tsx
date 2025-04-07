'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.scss';

export default function AdminChoicePage() {
  const router = useRouter();

  function handleAdminChoice(destination: 'main' | 'admin') {
    router.push(destination === 'main' ? '/yoohoo' : '/admin');
  }

  return (
    <div className={styles.adminChoiceContainer}>
      <div className={styles.questionContainer}>
        <h2>
          <span className={styles.hi}>안녕하세요! 관리자님,</span>어디로
          이동할까요?
        </h2>
        <div className={styles.buttonContainer}>
          <button onClick={() => handleAdminChoice('main')}>
            <Image src='/images/login-main.png' alt='home' width={60} height={60} />
            <span>메인</span>
          </button>
          <button onClick={() => handleAdminChoice('admin')}>
            <Image src='/images/login-admin.png' alt='home' width={60} height={60} />
            <span>관리자</span>
          </button>
        </div>
      </div>
    </div>
  );
}
