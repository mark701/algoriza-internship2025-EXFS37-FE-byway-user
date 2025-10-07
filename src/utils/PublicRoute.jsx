import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from './authAtom';
import { isTokenExpired } from './TokenExpire';

export default function PublicRoute({ children }) {
  const [token, setToken] = useAtom(authAtom);

  if (token && !isTokenExpired(token)) {
    return <Navigate to="/" replace />; 
  }
  
  // Clear expired token
  if (token && isTokenExpired(token)) {
    setToken(null);
  }
  return children;
}
