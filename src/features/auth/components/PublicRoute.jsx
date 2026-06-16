import { Navigate, Outlet } from 'react-router';

/**
 * Component PublicRoute ngăn chặn người dùng đã đăng nhập truy cập lại vào các trang công khai 
 * (ví dụ như trang LoginPage, RegisterPage).
 * Nếu họ đã có phiên đăng nhập hợp lệ, hệ thống sẽ tự động chuyển hướng họ vào dashboard.
 */
export function PublicRoute() {
  // Kiểm tra token và thông tin user trong localStorage
  const token = localStorage.getItem('mangak-token');
  const userString = localStorage.getItem('user');

  // Nếu cả token và user đều tồn tại, nghĩa là người dùng đang trong trạng thái đã đăng nhập
  if (token && userString) {
    // Object map từ role trong DB sang đường dẫn route trên FE (xử lý cả một số case viết hoa/thường)
    const rolePathMap = {
      mangaka: 'mangaka',
      assistant: 'assistant',
      tantou: 'tantouEditor', // tantou trong DB map với route /tantouEditor
      tantoueditor: 'tantouEditor',
      editorial: 'editorialBoard',
      editorialboard: 'editorialBoard',
      admin: 'admin',
      reader: 'reader',
    };

    try {
      // Giải mã JSON thông tin user
      const user = JSON.parse(userString);
      const userRole = (user.role || '').toLowerCase();
      
      // Nếu user có role hợp lệ, tự động đẩy họ về trang dashboard tương ứng với role đó
      if (userRole) {
        const rolePath = rolePathMap[userRole] || userRole;
        return <Navigate to={`/${rolePath}`} replace />;
      }
    } catch (error) {
      // Nếu dữ liệu localStorage bị lỗi (parse JSON thất bại), xóa sạch dữ liệu lỗi đi
      // Để người dùng ở lại trang Public (như trang Đăng nhập) để đăng nhập lại
      localStorage.removeItem('mangak-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  // Nếu chưa đăng nhập (hoặc dữ liệu lỗi đã bị xóa), cho phép truy cập các route con (ví dụ component LoginForm)
  return <Outlet />;
}
