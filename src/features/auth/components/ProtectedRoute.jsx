import { Navigate, Outlet } from 'react-router';

/**
 * ProtectedRoute checks authentication status and enforces role-based access control.
 * Unauthenticated users are redirected to '/login'.
 * Authenticated but unauthorized users are redirected to their corresponding role's dashboard.
 */
export function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem('mangak-token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    const userRole = (user.role || '').toLowerCase();

    if (userRole !== allowedRole.toLowerCase()) {
      return <Navigate to={`/${userRole}`} replace />;
    }
  } catch (error) {
    // Clear potentially corrupted session data
    localStorage.removeItem('mangak-token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
