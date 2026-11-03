const TOKEN_KEY = "erbs_token";
const REMEMBER_KEY = "erbs_remember";

function storage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, remember = true): void {
  clearToken();
  storage(remember).setItem(TOKEN_KEY, token);
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  window.dispatchEvent(new Event("erbs:token"));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("erbs:token"));
}

export function getRememberPreference(): boolean {
  return localStorage.getItem(REMEMBER_KEY) !== "0";
}
