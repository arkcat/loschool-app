export function getDayOfWeek(): number {
  const now = new Date();
  const dayIndex = now.getDay();
  return (dayIndex + 4) % 7;
}
