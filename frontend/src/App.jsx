import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ScrollToTop';
<<<<<<< HEAD
import useAuth from './hooks/useAuth';
import AuthFullscreenLoader from './components/auth/AuthFullscreenLoader';

function App() {
  const { initializing } = useAuth();

  if (initializing) {
    return <AuthFullscreenLoader message="Preparing your next outing..." rotate={false} />;
  }

=======

function App() {
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
