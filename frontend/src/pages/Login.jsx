import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthPanel, { AuthField } from '../components/auth/AuthPanel';
import useAuth from '../hooks/useAuth';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../routes/paths';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from ?? { pathname: ROUTES.MY_TRIPS };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <AuthPanel
        badge="Welcome back"
        title="Sign in to your account"
        description="Access your saved trips and pick up where you left off."
        submitLabel="Login"
        submittingLabel="Signing you in..."
        loadingHint="Loading your trips..."
        footerText="New here?"
        footerLinkLabel="Create an account"
        footerLinkTo={ROUTES.REGISTER}
        footerLinkState={{ from }}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        <AuthField
          label="Username"
          value={username}
          onChange={setUsername}
          autoComplete="username"
        />

        <AuthField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
      </AuthPanel>
    </AppLayout>
  );
}

export default Login;