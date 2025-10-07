import { atom } from 'jotai';


const TokenURL = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/";
const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;
  }
};

export const getUserCartKey = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = parseJWT(token);
  if (!decoded) return null;

  const nameId = decoded[`${TokenURL}nameidentifier`];
  const email = decoded[`${TokenURL}emailaddress`];

  if (!nameId || !email) return null; // safety check

  return `cart_${nameId}_${email}`;
};

const loadCart = () => {

  const key = getUserCartKey();
  if (!key) return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};



export const cartAtom = atom(
  loadCart(),
  (get, set, newCart) => {
    const key = getUserCartKey();
    if (!key) return;

    if (newCart.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newCart)); 
    }

    set(cartAtom, newCart);
  }
);

export const isCourseInCartAtom = atom(
  (get) => (courseId) => get(cartAtom).some(c => c.courseID === courseId)
);

export const isCartEmptyAtom = atom((get) => get(cartAtom).length === 0);