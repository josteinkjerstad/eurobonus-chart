type QualifyingPeriod = {
  month: number;
  label: string;
};

export const getAllValidQualifyingPeriods = (): QualifyingPeriod[] => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return [
    { month: 1, label: `1. Jan ${currentYear} - 31. Dec ${currentYear}` },
    { month: 2, label: `1. Feb ${currentYear} - 31. Jan ${currentYear + 1}` },
    { month: 3, label: `1. Mar ${currentYear} - 28. Feb ${currentYear + 1}` },
    { month: 4, label: `1. Apr ${currentYear} - 31. Mar ${currentYear + 1}` },
    { month: 5, label: `1. May ${currentYear} - 30. Apr ${currentYear + 1}` },
    { month: 6, label: `1. Jun ${currentYear} - 31. May ${currentYear + 1}` },
    { month: 7, label: `1. Jul ${currentYear} - 30. Jun ${currentYear + 1}` },
    { month: 8, label: `1. Aug ${currentYear} - 31. Jul ${currentYear + 1}` },
    { month: 9, label: `1. Sep ${currentYear} - 31. Aug ${currentYear + 1}` },
    { month: 10, label: `1. Oct ${currentYear} - 30. Sep ${currentYear + 1}` },
    { month: 11, label: `1. Nov ${currentYear} - 31. Oct ${currentYear + 1}` },
    { month: 12, label: `1. Dec ${currentYear} - 30. Nov ${currentYear + 1}` },
  ].map(period => {
    if (period.month > currentMonth) {
      const startYear = currentYear - 1;
      const endYear = currentYear;
      period.label = period.label.replace(`${currentYear}`, `${startYear}`).replace(`${currentYear + 1}`, `${endYear}`);
    }
    return period;
  });
};
