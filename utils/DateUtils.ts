export function getDayOfWeek(): number {
  const now = new Date();
  const dayIndex = now.getDay();
  return (dayIndex + 4) % 7;
}

export function checkWeek() {
  const startDate = new Date(2023, 10, 29, 6, 0, 0, 0);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const weeksPassed = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
  console.log(weeksPassed);
  return weeksPassed % 2 !== 0;
}
