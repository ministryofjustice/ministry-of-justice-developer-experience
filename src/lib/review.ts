import type { ReviewStatus } from '@/components/templateRender/ReviewBadge';

function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getReviewStatus(
  lastReviewedOn?: string,
  reviewIn?: string,
  now: Date = new Date(),
): ReviewStatus | null {
  if (!lastReviewedOn || !reviewIn) return null;

  const lastReviewed = parseLocalDate(lastReviewedOn);

  if (Number.isNaN(lastReviewed.getTime())) return null;

  const months = parseInt(reviewIn, 10) || 6;

  const dueDate = new Date(lastReviewed);
  dueDate.setMonth(dueDate.getMonth() + months);

  const warningDate = new Date(dueDate);
  warningDate.setMonth(warningDate.getMonth() - 1);

  if (now > dueDate) return 'overdue';
  if (now > warningDate) return 'warning';

  return 'ok';
}
