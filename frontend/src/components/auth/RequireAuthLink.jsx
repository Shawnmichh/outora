import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/paths';

function normalizeToLocation(to) {
  if (typeof to === 'string') {
    const [pathname, search = ''] = to.split('?');
    return { pathname, search: search ? `?${search}` : '' };
  }
  if (to && typeof to === 'object') {
    const pathname = to.pathname ?? '';
    const search = to.search ?? '';
    return { pathname, search };
  }
  return { pathname: ROUTES.HOME };
}

function RequireAuthLink({ to, state, ...props }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Link to={to} state={state} {...props} />;
  }

  const from = normalizeToLocation(to);
  return <Link to={ROUTES.LOGIN} state={{ from }} {...props} />;
}

export default RequireAuthLink;

