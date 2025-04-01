'use client';

import Image from 'next/image';
import { DogSummary, Dog, Gender, DogStatus } from '@/types/dog';
import styles from './DogDetailView.module.scss';

interface DogDetailViewProps {
  selectedDog: DogSummary;
  dogDetails: Dog;
  onClose: () => void;
}

export default function DogDetailView({
  selectedDog,
  dogDetails,
  onClose,
}: DogDetailViewProps) {
  return (
    <div className={styles.dogDetailView}>
      <button className={styles.backButton} onClick={onClose}>
        ← 목록으로 돌아가기
      </button>

      <div className={styles.dogDetailContainer}>
        <div className={styles.dogDetailHeader}>
          <div className={styles.dogImageContainer}>
            <Image
              src='/images/dummy.jpeg'
              alt={selectedDog.name}
              className={styles.dogDetailImage}
              width={400}
              height={400}
            />
          </div>
          <div className={styles.dogInfoContainer}>
            <h2 className={styles.dogName}>{selectedDog.name}</h2>
            <div className={styles.dogBasicInfo}>
              <p>
                <span className={styles.infoLabel}>나이:</span> {dogDetails.age}
                살
              </p>
              <p>
                <span className={styles.infoLabel}>성별:</span>{' '}
                {dogDetails.gender === Gender.MALE ? '남아' : '여아'}
              </p>
              <p>
                <span className={styles.infoLabel}>품종:</span>{' '}
                {dogDetails.breed}
              </p>
              <p>
                <span className={styles.infoLabel}>체중:</span>{' '}
                {dogDetails.weight}kg
              </p>
              <p>
                <span className={styles.infoLabel}>중성화:</span>{' '}
                {dogDetails.isNeutered ? '완료' : '미완료'}
              </p>
              <p>
                <span className={styles.infoLabel}>예방접종:</span>{' '}
                {dogDetails.isVaccination ? '완료' : '미완료'}
              </p>
              <p>
                <span className={styles.infoLabel}>보호 상태:</span>{' '}
                {dogDetails.status === DogStatus.PROTECTED
                  ? '보호 중'
                  : dogDetails.status === DogStatus.ADOPTED
                    ? '입양 완료'
                    : dogDetails.status === DogStatus.TEMPORARY
                      ? '임시 보호 중'
                      : '사망'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.dogDetailContent}>
          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>소개</h3>
            <p className={styles.sectionContent}>
              {dogDetails.name}는 {dogDetails.breed} 품종으로, {dogDetails.age}
              살 {dogDetails.gender === Gender.MALE ? '남아' : '여아'}입니다.
              {new Date(dogDetails.admissionDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              부터 저희 보호소에서 보호 중입니다.
            </p>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>성격</h3>
            <div className={styles.personalityContainer}>
              <div className={styles.personalityItem}>
                <span className={styles.personalityLabel}>활발함</span>
                <div className={styles.personalityBar}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`${styles.personalityLevel} ${level <= dogDetails.energetic ? styles.active : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.personalityItem}>
                <span className={styles.personalityLabel}>친화력</span>
                <div className={styles.personalityBar}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`${styles.personalityLevel} ${level <= dogDetails.familiarity ? styles.active : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <ul className={styles.tagList}>
              {dogDetails.energetic >= 4 && (
                <li className={styles.tag}>활발함</li>
              )}
              {dogDetails.energetic <= 2 && (
                <li className={styles.tag}>조용함</li>
              )}
              {dogDetails.familiarity >= 4 && (
                <li className={styles.tag}>사교적</li>
              )}
              {dogDetails.familiarity <= 2 && (
                <li className={styles.tag}>독립적</li>
              )}
              <li className={styles.tag}>
                {dogDetails.isNeutered ? '중성화 완료' : '중성화 필요'}
              </li>
            </ul>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>건강 상태</h3>
            <ul className={styles.medicalList}>
              <li>예방접종: {dogDetails.isVaccination ? '완료' : '미완료'}</li>
              <li>중성화: {dogDetails.isNeutered ? '완료' : '미완료'}</li>
              <li>정기 건강검진: 진행 중</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
