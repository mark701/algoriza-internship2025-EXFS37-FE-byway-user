
import { Navigate, useLocation } from 'react-router-dom';
import { isTokenExpired } from './TokenExpire';
import { useAtom } from 'jotai';
import { authAtom } from './authAtom';
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [token, setToken] = useAtom(authAtom);
  if (!token || isTokenExpired(token)) {
        if (token && isTokenExpired(token)) {
      setToken(null);
    }
     return <Navigate to="/login" state={{ from: location }} replace />;

  }

  return children;
}
