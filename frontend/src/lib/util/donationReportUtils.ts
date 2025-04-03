import { Donation, ReportData } from '@/types/donation';

// 최근 5주 라벨 계산
export const getLast5Weeks = () => {
  const weeks = [];
  const today = new Date();

  for (let i = 4; i >= 0; i--) {
    // i주 전의 날짜 계산
    const weekDate = new Date();
    weekDate.setDate(today.getDate() - i * 7);

    // 해당 주의 시작일 (일요일)과 종료일 (토요일) 계산
    const startOfWeek = new Date(weekDate);
    startOfWeek.setDate(weekDate.getDate() - weekDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // 표시 형식: "M/D~M/D"
    const startMonth = startOfWeek.getMonth() + 1;
    const startDay = startOfWeek.getDate();
    const endMonth = endOfWeek.getMonth() + 1;
    const endDay = endOfWeek.getDate();

    const weekLabel = `${startMonth}/${startDay}~${endMonth}/${endDay}`;

    weeks.push({
      label: weekLabel,
      startDate: new Date(startOfWeek),
      endDate: new Date(endOfWeek),
    });
  }

  return weeks;
};

// 주별 후원 횟수 계산
export const calculateWeeklyDonations = (
  donations: Donation[],
  weeks: any[]
) => {
  const labels = weeks.map((w) => w.label);
  const values = Array(weeks.length).fill(0);

  donations.forEach((donation) => {
    const donationDate = new Date(donation.donationDate);

    weeks.forEach((week, index) => {
      // 해당 주의 시작일과 종료일 사이에 후원 날짜가 있는지 확인
      if (donationDate >= week.startDate && donationDate <= week.endDate) {
        values[index]++;
      }
    });
  });

  return { labels, values };
};

// 단체별 후원 비율 계산 (상위 6개)
export const calculateShelterDonations = (donations: Donation[]) => {
  // 보호소 이름으로 기부 횟수 집계
  const shelterCounts = donations.reduce(
    (acc: Record<string, number>, donation) => {
      const shelterName = donation.shelterName;
      acc[shelterName] = (acc[shelterName] || 0) + 1;
      return acc;
    },
    {}
  );

  // 횟수 기준으로 내림차순 정렬 후 상위 6개만 추출
  const sortedShelters = Object.entries(shelterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    labels: sortedShelters.map(([name]) => name),
    values: sortedShelters.map(([, count]) => count),
  };
};

// 후원 내역 데이터를 리포트에 맞게 가공하는 함수
export const processDataForReport = (
  donations: Donation[],
  username: string
): ReportData => {
  // 1. 후원 유형 (단체 후원 vs 지정 후원)
  const organizationDonations = donations.filter(
    (d) => d.dogName === null
  ).length;
  const specificDogDonations = donations.filter(
    (d) => d.dogName !== null
  ).length;

  // 2. 주별 후원 데이터 계산
  const last5Weeks = getLast5Weeks();
  const weeklyDonationData = calculateWeeklyDonations(donations, last5Weeks);

  // 3. 단체별 후원 비율 계산
  const shelterDonation = calculateShelterDonations(donations);

  return {
    donationType: {
      labels: ['단체 후원', '지정 후원'],
      values: [organizationDonations, specificDogDonations],
    },
    weeklyDonation: {
      labels: weeklyDonationData.labels,
      values: weeklyDonationData.values,
      totalCount: donations.length,
      recentPeriods: 5,
    },
    shelterDonation: shelterDonation,
    username: username,
  };
};
