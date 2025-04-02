import { ReactNode } from 'react';
import styles from './SectionBox.module.scss';

interface SectionBoxProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleRight?: ReactNode;
}

export default function SectionBox({
  title,
  subtitle,
  children,
  className = '',
  titleRight,
}: SectionBoxProps) {
  return (
    <section className={`${styles.sectionBox} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.titleArea}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {titleRight && <div className={styles.titleRight}>{titleRight}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
