export const pickDatesInsidePeriod = (
  dates: string[] | Date[],
  start: Date,
  end: Date,
) => {
  let initialArray =
    typeof dates[0] == 'string'
      ? dates.map((str) => new Date(Date.parse(str as string)))
      : (dates as Date[]);
  return initialArray.filter((day) => day >= start && day <= end);
};
