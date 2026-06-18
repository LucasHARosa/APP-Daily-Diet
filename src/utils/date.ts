import type { Meal } from '@/types/api';

export function parseFormDateTime(date: string, time: string): string {
  // "15/06/2026" + "12:00" → "2026-06-15T12:00:00.000Z"
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}T${time}:00.000Z`;
}

export function formatDateLabel(iso: string): string {
  // "2026-06-15T12:00:00Z" → "15.06.26"
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(2);
  return `${dd}.${mm}.${yy}`;
}

export function formatTimeLabel(iso: string): string {
  // "2026-06-15T12:00:00Z" → "12:00"
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}

export function formatDateForForm(iso: string): string {
  // "2026-06-15T12:00:00Z" → "15/06/2026"
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getUTCFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

export function groupMealsByDate(meals: Meal[]): { date: string; data: Meal[] }[] {
  const map = new Map<string, Meal[]>();

  for (const meal of meals) {
    const label = formatDateLabel(meal.eaten_at);
    const existing = map.get(label);
    if (existing) {
      existing.push(meal);
    } else {
      map.set(label, [meal]);
    }
  }

  return Array.from(map.entries()).map(([date, data]) => ({ date, data }));
}

export function formatISODateLabel(date: string): string {
  // "2026-06-15" → "15.06.26"
  const [yyyy, mm, dd] = date.split('-');
  return `${dd}.${mm}.${yyyy.slice(2)}`;
}

export function formatISODate(date: Date): string {
  // Date → "YYYY-MM-DD"
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function ageToBirthDate(age: number): string {
  // Aproximação: usa 1º de janeiro do ano de nascimento
  const birthYear = new Date().getFullYear() - age;
  return `${birthYear}-01-01`;
}

export function birthDateToAge(birthDate: string): number {
  const birthYear = Number(birthDate.slice(0, 4));
  return new Date().getFullYear() - birthYear;
}
