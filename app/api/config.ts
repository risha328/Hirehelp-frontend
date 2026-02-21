export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Returns the full URL for a file (logo, resume, cover letter).
 * If url is already absolute (http/https), returns as-is.
 * Otherwise prefixes with API base URL for backward compatibility with legacy /uploads paths.
 */
export function getFileUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
}
