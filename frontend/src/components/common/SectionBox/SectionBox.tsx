import { ReactNode } from 'react';
import styles from './SectionBox.module.scss';

interface SectionBoxProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionBox({
  title,
  subtitle,
  children,
  className = '',
}: SectionBoxProps) {
  return (
    <section className={`${styles.sectionBox} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
