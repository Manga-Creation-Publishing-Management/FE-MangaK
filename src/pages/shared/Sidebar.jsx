import { useState } from 'react';
import {
  Home, FolderKanban, DollarSign, TrendingUp, Settings,
  CalendarClock, CheckSquare, ClipboardList, FileSearch, BookMarked,
  Menu, Upload
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Logo } from '../../shared/components/Logo';

// Component Sidebar hiển thị thanh menu chức năng bên trái của ứng dụng
export function Sidebar({ userRole }) {
  // Hook useLocation để lấy URL hiện tại, giúp xác định tab nào đang active
  const location = useLocation();
  // State quản lý việc Sidebar đang mở rộng (true) hay thu gọn (false)
  const [isOpen, setIsOpen] = useState(true);

  // Đối tượng chứa danh sách các menu ứng với từng vai trò (role) của người dùng
  const menuItems = {
    reader: [
      { icon: Home, label: 'Dashboard', path: '/reader', key: 'dashboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/reader/profile', key: 'profile' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin', key: 'dashboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/admin/profile', key: 'profile' },
    ],
    mangaka: [
      { icon: Home, label: 'Dashboard', path: '/mangaka', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Management', path: '/mangaka/series', key: 'series' },
      { icon: ClipboardList, label: 'Task Management', path: '/mangaka/tasks', key: 'tasks' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/mangaka/leaderboard', key: 'leaderboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/mangaka/profile', key: 'profile' },
    ],
    assistant: [
      { icon: Home, label: 'Dashboard', path: '/assistant', key: 'dashboard' },
      { icon: CheckSquare, label: 'My Tasks', path: '/assistant/tasks', key: 'tasks' },
      { icon: DollarSign, label: 'Income', path: '/assistant/income', key: 'income' },
      { icon: Settings, label: 'Profile & Settings', path: '/assistant/profile', key: 'profile' },
    ],
    tantou: [
      { icon: Home, label: 'Dashboard', path: '/tantou', key: 'dashboard' },
      { icon: FolderKanban, label: 'Series Review', path: '/tantou/series', key: 'series' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/tantou/leaderboard', key: 'leaderboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/tantou/profile', key: 'profile' },
    ],
    editorial: [
      { icon: Home, label: 'Dashboard', path: '/editorial', key: 'dashboard' },
      { icon: FileSearch, label: 'Series Approval', path: '/editorial/series', key: 'series' },
      { icon: CalendarClock, label: 'Publishing Schedule', path: '/editorial/schedule', key: 'schedule' },
      { icon: TrendingUp, label: 'Leaderboard', path: '/editorial/leaderboard', key: 'leaderboard' },
      { icon: Settings, label: 'Profile & Settings', path: '/editorial/profile', key: 'profile' },
    ],
  };

  // Lấy ra danh sách menu tương ứng với role hiện tại (nếu không có thì trả về mảng rỗng)
  const items = menuItems[userRole] ?? [];

  return (
    // Container chính của Sidebar. Sử dụng transition để hiệu ứng đóng/mở mượt mà.
    // Nếu isOpen = true thì w-64 (mở rộng), ngược lại w-20 (thu gọn)
    <div
      className={`bg-sidebar border-r border-sidebar-border h-screen p-4 transition-all duration-300 relative flex flex-col ${isOpen ? 'w-64' : 'w-20'
        }`}
    >
      {/* Vùng chứa Logo và nút Toggle (ẩn/hiện sidebar) */}
      <div className={`flex items-center mb-6 ${isOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
        <Logo size="sm" showText={isOpen} to={`/${userRole}`} />
        <button
          onClick={() => setIsOpen(!isOpen)} // Đổi trạng thái mở/đóng Sidebar khi click
          className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border transition-colors shrink-0"
          title={isOpen ? "Đóng sidebar" : "Mở sidebar"}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Danh sách các link điều hướng */}
      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const Icon = item.icon; // Lấy icon tương ứng từ cấu hình menu
          
          // Loại bỏ dấu '/' ở cuối đường dẫn (nếu có) để so sánh chuỗi chính xác hơn
          const cleanPath = location.pathname.replace(/\/$/, "");
          const cleanItemPath = item.path.replace(/\/$/, "");
          
          // Kiểm tra xem menu item này có đang được chọn (active) hay không.
          // Đối với dashboard, bắt buộc phải khớp chính xác đường dẫn.
          // Đối với các mục khác, chỉ cần đường dẫn hiện tại bắt đầu bằng đường dẫn của item.
          const isActive = item.key === 'dashboard'
            ? cleanPath === cleanItemPath
            : cleanPath.startsWith(cleanItemPath);

          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors unique-sidebar-item ${isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground' // Đang active thì highlight
                : 'text-sidebar-foreground hover:bg-sidebar-accent' // Trạng thái bình thường
                } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.label : undefined} // Khi sidebar đóng, hiển thị tooltip để người dùng biết chức năng
            >
              <Icon size={20} className="shrink-0" />
              {/* Nếu Sidebar đang mở thì hiển thị thêm dòng text (label) */}
              {isOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}