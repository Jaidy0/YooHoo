import styles from './page.module.scss';

export default function AdminPage() {
  return (
    <div>
      <div className={styles.adminShelterInfo}>단체정보</div>
      <div>신뢰지수</div>
      <div>발자국</div>
    </div>
  );
}
