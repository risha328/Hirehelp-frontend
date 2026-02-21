export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Cloudinary cloud name for building logo URLs when only a path is stored (e.g. hirehelp/logos/...) */
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

/**
 * Returns the full URL for a file (logo, resume, cover letter).
 * - Cloudinary URLs (https://res.cloudinary.com/...) are returned as-is (logos are fetched from Cloudinary).
 * - Paths that look like Cloudinary logos (e.g. "hirehelp/logos/...") are turned into full Cloudinary URLs when cloud name is set.
 * - Other absolute URLs (http/https) are returned as-is.
 * - Relative paths are prefixed with API base URL for legacy /uploads compatibility.
 */
export function getFileUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (CLOUDINARY_CLOUD_NAME && (url.includes('hirehelp/logos') || url.startsWith('logos/'))) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${url.replace(/^\//, '')}`;
  }
  return `${API_BASE_URL}${url}`;
}
