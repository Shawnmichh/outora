import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ScrollToTop';
import useAuth from './hooks/useAuth';
import AuthFullscreenLoader from './components/auth/AuthFullscreenLoader';

function App() {
  const { initializing } = useAuth();

  if (initializing) {
    return <AuthFullscreenLoader message="Preparing your next outing..." rotate={false} />;
  }

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
