const SAVED_JOBS_KEY = 'hirehelp_saved_jobs';

export function getSavedJobIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function setSavedJobIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function isJobSaved(jobId: string): boolean {
  return getSavedJobIds().includes(jobId);
}

export function addSavedJob(jobId: string): void {
  const ids = getSavedJobIds();
  if (ids.includes(jobId)) return;
  setSavedJobIds([...ids, jobId]);
}

export function removeSavedJob(jobId: string): void {
  setSavedJobIds(getSavedJobIds().filter(id => id !== jobId));
}

export function toggleSavedJob(jobId: string): boolean {
  const ids = getSavedJobIds();
  const has = ids.includes(jobId);
  if (has) {
    setSavedJobIds(ids.filter(id => id !== jobId));
    return false;
  }
  setSavedJobIds([...ids, jobId]);
  return true;
}
