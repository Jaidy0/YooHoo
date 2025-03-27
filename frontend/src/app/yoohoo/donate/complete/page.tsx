import Link from 'next/link';
import DonateComplete from '@/components/donations/DonateComplete';
import styles from './page.module.scss';

export default function DonationCompletePage() {
  return (
    <div className={styles.completePage}>
      {/* 상단 로고 */}

      {/* 콘텐츠 박스 */}
      <div className={styles.contentBox}>
        <h1 className={styles.title}>후원 완료</h1>
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
          <Link href='/' passHref>
            {/* <Button as="a">홈으로</Button> */}
          </Link>
          <Link href='/mypage/donation' passHref>
            {/* <Button as="a">기부 내역 보러가기</Button> */}
          </Link>
        </div>
      </div>
    </div>
  );
}
