import type { Application } from '../api/applications';

export type OfferStatusType = 'not_sent' | 'accepted' | 'pending' | 'declined';

/**
 * Single source of truth for offer letter status.
 * Use for HIRED applications only; for other statuses the result is 'not_sent'.
 */
export function getOfferStatus(app: Pick<Application, 'status' | 'offerLetterUrl' | 'offerAccepted'>): OfferStatusType | null {
  if (app.status !== 'HIRED') return null;
  if (!app.offerLetterUrl) return 'not_sent';
  if (app.offerAccepted === true) return 'accepted';
  if (app.offerAccepted === false) return 'declined';
  return 'pending';
}

export function getOfferStatusLabel(status: OfferStatusType): string {
  switch (status) {
    case 'not_sent': return 'Offer not sent';
    case 'accepted': return 'Accepted';
    case 'pending': return 'Pending';
    case 'declined': return 'Declined';
    default: return '—';
  }
}

export function getOfferStatusStyles(status: OfferStatusType): { className: string; icon: 'CheckCircle' | 'Clock' | 'XCircle' | 'FileText' } {
  switch (status) {
    case 'accepted':
      return { className: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: 'CheckCircle' };
    case 'pending':
      return { className: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'Clock' };
    case 'declined':
      return { className: 'bg-red-50 text-red-700 border-red-200', icon: 'XCircle' };
    case 'not_sent':
      return { className: 'bg-gray-100 text-gray-600 border-gray-200', icon: 'FileText' };
    default:
      return { className: 'bg-gray-100 text-gray-600 border-gray-200', icon: 'FileText' };
  }
}
