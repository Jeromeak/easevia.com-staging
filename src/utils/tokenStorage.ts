import Cookies from 'js-cookie';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const COOKIE_OPTIONS = { path: '/', sameSite: 'Lax' as const }; // You can also add `secure: true` in production

// Save tokens to both localStorage and cookies
export const saveTokens = (access: string, refresh: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
  }

  Cookies.set(ACCESS_TOKEN, access, COOKIE_OPTIONS);
  Cookies.set(REFRESH_TOKEN, refresh, COOKIE_OPTIONS);
};

// Get access token from localStorage or cookies
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN) || Cookies.get(ACCESS_TOKEN) || null;
  }

  return Cookies.get(ACCESS_TOKEN) || null;
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN) || Cookies.get(REFRESH_TOKEN) || null;
  }

  return Cookies.get(REFRESH_TOKEN) || null;
};

// Clear tokens from both
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  Cookies.remove(ACCESS_TOKEN, COOKIE_OPTIONS);
  Cookies.remove(REFRESH_TOKEN, COOKIE_OPTIONS);
};
