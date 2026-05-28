import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from './paths';
import AuthFullscreenLoader from '../components/auth/AuthFullscreenLoader';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return (
      <AuthFullscreenLoader
        message="Restoring your saved journeys..."
        rotate={false}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;