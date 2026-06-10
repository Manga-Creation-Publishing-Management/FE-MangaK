import { Navigate, Outlet } from 'react-router';

/**
 * PublicRoute prevents logged-in users from accessing anonymous-only pages (e.g. LoginPage).
 * If a valid session is active, they are automatically redirected to their dashboard.
 */
export function PublicRoute() {
  const token = localStorage.getItem('mangak-token');
  const userString = localStorage.getItem('user');

  if (token && userString) {
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
      if (userRole) {
        const rolePath = rolePathMap[userRole] || userRole;
        return <Navigate to={`/${rolePath}`} replace />;
      }
    } catch (error) {
      // Clear corrupted local storage data so user can re-authenticate
      localStorage.removeItem('mangak-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  // Allow access to login if not authenticated
  return <Outlet />;
}
