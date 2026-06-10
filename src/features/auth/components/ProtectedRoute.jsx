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

  const rolePathMap = {
    mangaka: 'mangaka',
    assistant: 'assistant',
    tantou: 'tantouEditor',
    tantoueditor: 'tantouEditor',
    editorial: 'editorialBoard',
    editorialboard: 'editorialBoard',
    admin: 'admin',
    reader: 'reader',
  };

  try {
    const user = JSON.parse(userString);
    const userRole = (user.role || '').toLowerCase();
    const normalizedUserRole = rolePathMap[userRole] || userRole;

    if (normalizedUserRole !== allowedRole) {
      return <Navigate to={`/${normalizedUserRole}`} replace />;
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
