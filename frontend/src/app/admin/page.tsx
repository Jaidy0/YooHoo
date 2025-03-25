import styles from './page.module.scss';
import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';

export default function AdminPage() {
  return (
    <div className={styles.adminShelter}>
      <div className={styles.adminShelterInfo}>
        <div className={styles.shelterPhoto}>
          <Image
            src='/images/dummy.jpeg'
            alt='보호소 사진'
            width={345}
            height={345}
            className={styles.shelterImage}
            priority
          />
        </div>
        <div className={styles.shelterText}>
          <div className={styles.shelterTitle}>동물행동권 카라</div>
          <div className={styles.settingButton}>
            <IconBox name='gear'></IconBox>
          </div>
          <div className={styles.shelterInfoText}>
            {/* 설립연도 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>설립연도</div>
              <div className={styles.shelterInfoContent}>2020</div>
            </div>

            {/* 주소 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>주소</div>
              <div className={styles.shelterInfoContent}>
                서울시 마포구 잔다리로 122
              </div>
            </div>

            {/* 대표 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>대표</div>
              <div className={styles.shelterInfoContent}>진진경</div>
            </div>

            {/* 사업자등록번호 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>사업자등록번호</div>
              <div className={styles.shelterInfoContent}>114-82-09801</div>
            </div>

            {/* 전화번호 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>전화번호</div>
              <div className={styles.shelterInfoContent}>02-3482-0999</div>
            </div>

            {/* 이메일 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>이메일</div>
              <div className={styles.shelterInfoContent}>info@ekara.org</div>
            </div>

            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>단체 소개</div>
              <div className={styles.shelterInfoContent}>
                계획이 지나가는 하늘에는 가끔은 기록 자국이 있습니다. 나는 아무
                작업도 없이 가볍게 떨림을 다 털 듯합니다. 가슴 속에 하나 툭
                새겨지는 별들 어떤 다 종이 없이 야간이
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.adminShelterDetail}>
        <div className={styles.adminTrust}>
          <div className={styles.trustContent}>
            <div className={styles.trustHeader}>
              <div className={styles.adminTitle}>단체 신뢰 지수</div>
              <div className={styles.questionButton}>
                <IconBox name='zoom'></IconBox>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.adminFootPrint}>
          <div className={styles.footPrintContent}>
            <div className={styles.trustHeader}>
              <div className={styles.adminTitle}>단체 신뢰 지수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
