import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';
// import IconBox from '@/components/common/IconBox/IconBox';
import Image from 'next/image';
import Link from 'next/link';

// interface MainHeaderProps {
// onNotificationClick?: () => void;
// }

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (!headerRef.current) return;

      // 헤더의 높이를 가져옵니다
      const headerHeight = headerRef.current.offsetHeight;

      // 스크롤 위치가 헤더 높이보다 크거나 같으면 배경색을 변경합니다
      if (window.scrollY >= headerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.mainHeader} ${isScrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.left}>
        <Link href='/yoohoo' className={styles.logoLink}>
          <Image
            src='/images/yoohoo-logo.svg'
            alt='유후 Logo'
            width={100}
            height={32}
            className={styles.logo}
            priority
          />
        </Link>
      </div>
      {/* <div className={styles.right}>
        <button onClick={onNotificationClick} className={styles.iconButton}>
          <IconBox name='bell' size={24} color='#555' />
        </button>
      </div> */}
    </header>
  );
}
