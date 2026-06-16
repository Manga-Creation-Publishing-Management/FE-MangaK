import { Navigate, Outlet } from 'react-router';

/**
 * Component ProtectedRoute kiểm tra trạng thái đăng nhập và quyền truy cập (role-based access control).
 * Người dùng chưa đăng nhập sẽ bị đẩy về trang '/login'.
 * Người dùng đã đăng nhập nhưng truy cập sai role (ví dụ Mangaka cố vào trang của Admin)
 * sẽ bị đẩy về dashboard đúng với role của họ.
 */
export function ProtectedRoute({ allowedRole }) {
  // Lấy token và chuỗi thông tin user từ localStorage để kiểm tra trạng thái đăng nhập
  const token = localStorage.getItem('mangak-token');
  const userString = localStorage.getItem('user');

  // Nếu không có token hoặc không có thông tin user, lập tức đẩy về trang đăng nhập
  // Dùng thuộc tính replace để không lưu lịch sử trang hiện tại vào nút Back của trình duyệt
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  // Object map từ role trong DB sang đường dẫn route tương ứng trên FE
  const rolePathMap = {
    mangaka: 'mangaka',
    assistant: 'assistant',
    tantou: 'tantou',
    editorial: 'editorial',
    admin: 'admin',
    reader: 'reader',
  };

  try {
    // Chuyển chuỗi JSON chứa thông tin user thành Object
    const user = JSON.parse(userString);
    
    // Lấy ra role của user, đưa về chữ thường để dễ so sánh
    const userRole = (user.role || '').toLowerCase();
    
    // Tìm đường dẫn tương ứng với role, nếu không tìm thấy thì dùng chính tên role
    const normalizedUserRole = rolePathMap[userRole] || userRole;

    // Kiểm tra xem role của user hiện tại có khớp với role được phép truy cập route này không
    if (normalizedUserRole !== allowedRole) {
      // Nếu không khớp (truy cập trái phép), đẩy họ về đúng trang chủ của role đó
      return <Navigate to={`/${normalizedUserRole}`} replace />;
    }
  } catch (error) {
    // Bắt lỗi nếu quá trình parse JSON thất bại (ví dụ dữ liệu localStorage bị hỏng/sửa bậy)
    // Xóa sạch thông tin cũ để buộc người dùng đăng nhập lại
    localStorage.removeItem('mangak-token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập và đúng role, cho phép render component con (các Route bên trong)
  return <Outlet />;
}
