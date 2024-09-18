
function getStartOfWeek(date: Date, locale: string): Date {
  let firstDayOfWeek = 1;
  date.setHours(0, 0, 0, 0);
  

  if (locale === "pl" || locale === "uk") {
    firstDayOfWeek = 1;
  } else if (locale === "en") {
    firstDayOfWeek = 0;
  }

  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek >= firstDayOfWeek ? dayOfWeek - firstDayOfWeek : 6 - dayOfWeek;

  startOfWeek.setDate(startOfWeek.getDate() - diff);


  return startOfWeek;
}
export function getWeekFromDate(date:Date,locale:string):Date[] {
  const startOfWeek = getStartOfWeek(date,locale);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    days.push(currentDate);
  }
  return days;
}