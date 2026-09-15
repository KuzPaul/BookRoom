const STORAGE_KEY = "bookroom:rooms-office-id";

export function getStoredRoomsOfficeId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredRoomsOfficeId(officeId: string | null): void {
  try {
    if (officeId) {
      sessionStorage.setItem(STORAGE_KEY, officeId);
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}
