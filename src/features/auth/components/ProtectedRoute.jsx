import { Navigate, Outlet } from 'react-router';

export function ProtectedRoute({ allowedRole }) {
  
  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

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

    const normalizedUserRole = rolePathMap[userRole] || userRole;

    if (normalizedUserRole !== allowedRole) {
      
      return <Navigate to={`/${normalizedUserRole}`} replace />;
    }
  } catch (error) {
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
