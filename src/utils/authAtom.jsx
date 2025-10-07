import { atom } from 'jotai';
import { isTokenExpired } from './TokenExpire';
import { cartAtom } from './CartAtom';
import { getUserCartKey } from './CartAtom';
const getInitialToken = () => {
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    return token;
  }
  if (token) {
    localStorage.removeItem('token');
  }
  return null;
};

export const authAtom = atom(
  getInitialToken(),
  (get, set, newToken) => {
    if (newToken) {
      if (!isTokenExpired(newToken)) {
        localStorage.setItem('token', newToken);
        set(authAtom, newToken);

        const key = getUserCartKey();
        const stored = key ? localStorage.getItem(key) : null;
        set(cartAtom, stored ? JSON.parse(stored) : []);
      }
    } else {
      // Remove token
      localStorage.removeItem('token');
      set(authAtom, null);
    }
  }
);