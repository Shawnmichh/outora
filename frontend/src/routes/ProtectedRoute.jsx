import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from './paths';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 pt-32 text-center text-zinc-400">
        Loading your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
