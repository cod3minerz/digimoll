const STORAGE_KEY = "digimoll_mock_session";

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function setLoggedIn(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
