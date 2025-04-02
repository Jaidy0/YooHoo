import Link from 'next/link';
import Image from 'next/image';
import DonateComplete from '@/components/donations/DonateComplete';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';

export default function DonationCompletePage() {
  return (
    <div className={styles.completePage}>
      {/* 왼쪽 상단 로고 */}
      <Link href='/yoohoo' className={styles.logoWrapper}>
        <Image
          src='/images/yoohoo-logo.svg'
          alt='유후 로고'
          width={120}
          height={40}
          className={styles.logo}
        />
      </Link>

      {/* 콘텐츠 박스 */}
      <div className={styles.contentBox}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>후원 완료</h1>
          <Image
            src='/images/donatePaw.svg'
            alt='발자국'
            width={28}
            height={28}
            className={styles.pawPrint}
          />
        </div>
        <p className={styles.subtitle}>따뜻한 마음이 전달되었어요!</p>

        {/* Lottie 애니메이션과 배경 */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBackground}>
            <DonateComplete />
            <div className={styles.shadow}></div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <Link href='/yoohoo'>
            <Button>홈으로</Button>
          </Link>
          <Link href='/yoohoo/profile'>
            <Button>기부 내역 보러가기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
