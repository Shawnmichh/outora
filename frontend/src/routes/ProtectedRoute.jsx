import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from './paths';
<<<<<<< HEAD
import AuthFullscreenLoader from '../components/auth/AuthFullscreenLoader';
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
<<<<<<< HEAD
    return <AuthFullscreenLoader message="Restoring your saved journeys..." rotate={false} />;
=======
    return (
      <div className="min-h-screen bg-zinc-950 px-4 pt-32 text-center text-zinc-400">
        Loading your session...
      </div>
    );
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
