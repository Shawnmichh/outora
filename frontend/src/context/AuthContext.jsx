import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../services/authApi';
import AuthContext from './AuthContextCore';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const currentUser = await fetchCurrentUser();
        if (active) setUser(currentUser);
      } catch (error) {
        if (active) {
          setUser(null);
          
          // Only log unexpected errors (not 401/403 which are expected when unauthenticated)
          // 401 = No valid token/session exists (expected on first visit)
          // 403 = Token exists but is invalid/expired (expected after logout or expiry)
          // Other errors (network, 500, etc.) should be logged for debugging
          const isExpectedAuthError = error.status === 401 || error.status === 403;
          
          if (!isExpectedAuthError) {
            console.error('[Auth] Unexpected error during session restore:', error);
          }
          // Silently handle expected 401/403 - user simply isn't authenticated yet
        }
      } finally {
        if (active) setInitializing(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const applyAuthResponse = useCallback((payload) => {
    setUser(payload.user);
    return payload.user;
  }, []);

  const login = useCallback(
    async (credentials) => applyAuthResponse(await loginUser(credentials)),
    [applyAuthResponse],
  );

  const register = useCallback(
    async (payload) => applyAuthResponse(await registerUser(payload)),
    [applyAuthResponse],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Local logout should still complete if the token is already invalid.
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [initializing, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
