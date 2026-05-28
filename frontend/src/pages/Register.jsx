import { useState } from 'react';
<<<<<<< HEAD
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthPanel, { AuthField } from '../components/auth/AuthPanel';
import AvatarPicker from '../components/auth/AvatarPicker';
=======
import { Navigate, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthPanel, { AuthField } from '../components/auth/AuthPanel';
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
import useAuth from '../hooks/useAuth';
import { ApiError } from '../services/api/httpClient';
import { ROUTES } from '../routes/paths';

function Register() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  const { isAuthenticated, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [avatarId, setAvatarId] = useState('outora-01');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = location.state?.from ?? { pathname: ROUTES.MY_TRIPS };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
=======
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.MY_TRIPS} replace />;
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
<<<<<<< HEAD
      await register({ username, email, password, avatar_id: avatarId });
      navigate(from, { replace: true });
=======
      await register({ username, email, password });
      navigate(ROUTES.MY_TRIPS, { replace: true });
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
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
<<<<<<< HEAD
        title="Your next outing starts here"
        description="Create a profile to save plans, reopen trips in one tap, and keep your journeys tidy."
        submitLabel="Register"
        submittingLabel="Creating your account..."
        loadingHint="Preparing your profile and saved journeys..."
        footerText="Already have an account?"
        footerLinkLabel="Sign in"
        footerLinkTo={ROUTES.LOGIN}
        footerLinkState={{ from }}
=======
        title="Save every great outing"
        description="Create a secure profile for saved itineraries, trip history, and quick reopens."
        submitLabel="Register"
        footerText="Already have an account?"
        footerLinkLabel="Sign in"
        footerLinkTo={ROUTES.LOGIN}
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
<<<<<<< HEAD
        <AvatarPicker value={avatarId} onChange={setAvatarId} />
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
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
