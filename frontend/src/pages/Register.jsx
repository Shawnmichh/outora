import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthPanel, { AuthField } from '../components/auth/AuthPanel';
import useAuth from '../hooks/useAuth';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../routes/paths';

function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.MY_TRIPS} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({ username, email, password });
      navigate(ROUTES.MY_TRIPS, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <AuthPanel
        badge="Create account"
        title="Save every great outing"
        description="Create a secure profile for saved itineraries, trip history, and quick reopens."
        submitLabel="Register"
        footerText="Already have an account?"
        footerLinkLabel="Sign in"
        footerLinkTo={ROUTES.LOGIN}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        <AuthField label="Username" value={username} onChange={setUsername} autoComplete="username" />
        <AuthField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
      </AuthPanel>
    </AppLayout>
  );
}

export default Register;
