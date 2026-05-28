import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Tourist from '../pages/Tourist';
import Localite from '../pages/Localite';
import Questionnaire from '../pages/Questionnaire';
import Results from '../pages/Results';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyTrips from '../pages/MyTrips';
import SharedTrip from '../pages/SharedTrip';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import { ROUTES } from './paths';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />

      <Route
        path={ROUTES.TOURIST}
        element={(
          <ProtectedRoute>
            <Tourist />
          </ProtectedRoute>
        )}
      />

      <Route
        path={ROUTES.LOCALITE}
        element={(
          <ProtectedRoute>
            <Localite />
          </ProtectedRoute>
        )}
      />

      <Route
        path={ROUTES.QUESTIONNAIRE}
        element={(
          <ProtectedRoute>
            <Questionnaire />
          </ProtectedRoute>
        )}
      />

      <Route
        path={ROUTES.RESULTS}
        element={(
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        )}
      />

      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.SHARED_TRIP} element={<SharedTrip />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.PRIVACY} element={<Privacy />} />
      <Route path={ROUTES.TERMS} element={<Terms />} />

      <Route
        path={ROUTES.MY_TRIPS}
        element={(
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        )}
      />
    </Routes>
  );
}

export default AppRoutes;