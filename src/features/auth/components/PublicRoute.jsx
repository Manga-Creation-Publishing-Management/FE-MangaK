import { Navigate, Outlet } from 'react-router';

export function PublicRoute() {
  
  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');

  if (token && userString) {
    
    const rolePathMap = {
      mangaka: 'mangaka',
      assistant: 'assistant',
      tantou: 'tantou',
      editorial: 'editorial',
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
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  return <Outlet />;
}
