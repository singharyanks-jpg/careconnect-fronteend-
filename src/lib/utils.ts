import type { TriageLevel } from '../data/types';

/**
 * Validate phone number conforms to E.164 international standard.
 * Accepts formats like +919810123456 or +91 98101 23456
 */
export function isValidE164Phone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^\+[1-9]\d{7,14}$/.test(cleaned);
}

/**
 * Masks caller phone number for privacy:
 * Example: "+91 98118 76214" -> "+91 98••• ••214"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return 'Unknown Caller';
  const clean = phone.trim();
  if (clean.length < 8) return clean;

  const parts = clean.split(' ');
  if (parts.length >= 3) {
    const country = parts[0];
    const firstTwo = parts[1].slice(0, 2);
    const lastThree = parts[parts.length - 1].slice(-3);
    return `${country} ${firstTwo}••• ••${lastThree}`;
  }

  // Fallback if not space formatted
  const prefix = clean.slice(0, 5);
  const suffix = clean.slice(-3);
  return `${prefix}••••${suffix}`;
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Strict triage badge styling helper
 * Rule: Triage colours used ONLY for triage status:
 * red = critical, amber = urgent, green = routine. Never decoratively.
 */
export function getTriageColorClasses(triage: TriageLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (triage) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-600',
      };
    case 'urgent':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-600',
      };
    case 'routine':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        dot: 'bg-emerald-600',
      };
  }
}

/**
 * Format ISO timestamp to 24-hr time (HH:mm)
 */
export function formatTimeOnly(isoString?: string): string {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '--:--';
  }
}
