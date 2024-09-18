export function getDayOfWeek(date: Date): number {
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 6;
  } else {
    dayOfWeek -= 1;
  }
  return dayOfWeek;
}
